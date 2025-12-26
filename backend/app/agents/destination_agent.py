import os
import requests
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# 데이터 모델 정의 (프론트엔드 타입과 일치)
class Recommendation(BaseModel):
    destination: str = Field(description="도시 이름")
    country: str = Field(description="국가 이름")
    shortDescription: str = Field(description="짧은 설명")
    reasonForRecommendation: str = Field(description="추천 이유")
    estimatedTotalCost: str = Field(description="예상 총 비용")
    flightSuggestion: str = Field(description="항공편 제안")
    hotelSuggestion: str = Field(description="숙소 제안")
    imageUrl: str = Field(description="여행지 이미지 URL", default="")

class RecommendationsOutput(BaseModel):
    recommendations: List[Recommendation]

# 상태 정의
class DestinationState(TypedDict):
    user_input: dict
    recommendations: List[dict]

# LLM 설정
llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

# 파서 설정
parser = JsonOutputParser(pydantic_object=RecommendationsOutput)

# 프롬프트 템플릿
prompt = PromptTemplate(
    template="""You are a professional travel consultant.
    Recommend 3 travel destinations based on the following user preferences:
    {user_input}
    
    Return the result strictly in the following JSON format.
    {format_instructions}
    
    Ensure all text fields are in Korean.
    """,
    input_variables=["user_input"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

def fetch_destination_image(destination: str) -> str:
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        return f"https://picsum.photos/seed/{destination}/800/600"
    
    # 한글 검색어일 경우 정확도가 떨어질 수 있으므로 영문으로 변환하거나 그대로 시도
    # 여기서는 그대로 시도하되, 필요시 LLM에게 영문명을 요청할 수도 있음.
    # 일단 간단하게 구현
    url = f"https://api.unsplash.com/search/photos?query={destination}&per_page=1&client_id={access_key}&orientation=landscape"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                return data['results'][0]['urls']['regular']
    except Exception as e:
        print(f"Error fetching image for {destination}: {e}")
    
    return f"https://picsum.photos/seed/{destination}/800/600"

# 노드 함수 정의
def generate_recommendations(state: DestinationState):
    user_input = state["user_input"]
    chain = prompt | llm | parser
    try:
        response = chain.invoke({"user_input": user_input})
        recommendations = response['recommendations']
        
        # 이미지 URL 추가
        for rec in recommendations:
            rec['imageUrl'] = fetch_destination_image(rec['destination'])
            
        return {"recommendations": recommendations}
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {"recommendations": []}

# 그래프 구성
workflow = StateGraph(DestinationState)
workflow.add_node("generate_recommendations", generate_recommendations)
workflow.set_entry_point("generate_recommendations")
workflow.add_edge("generate_recommendations", END)

destination_graph = workflow.compile()
