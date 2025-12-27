import os
import requests
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults

load_dotenv()

# 데이터 모델 정의
class ItineraryActivity(BaseModel):
    time: str = Field(description="시간 (예: 오전 10:00)")
    activity: str = Field(description="활동 명")
    description: str = Field(description="활동 설명")

class ItineraryDay(BaseModel):
    day: int = Field(description="일차 (1, 2, 3...)")
    theme: str = Field(description="그 날의 테마")
    activities: List[ItineraryActivity]

class Attraction(BaseModel):
    name: str = Field(description="명소 이름")
    description: str = Field(description="명소에 대한 간단한 설명")
    imageUrl: str = Field(description="명소 이미지 URL", default="")

class ItineraryOutput(BaseModel):
    itinerary: List[ItineraryDay]
    attractions: List[Attraction] = Field(description="이 여행지에서 꼭 방문해야 할 주요 명소 3~4곳")

# 상태 정의
class ItineraryState(TypedDict):
    destination: str
    preferences: str
    research_data: str
    itinerary: List[dict]
    attractions: List[dict]

# LLM 설정
llm = ChatOpenAI(model="gpt-5", temperature=0.7)

# 도구 설정
tavily_tool = TavilySearchResults(max_results=5)

# 파서 설정
parser = JsonOutputParser(pydantic_object=ItineraryOutput)

# 프롬프트 템플릿
prompt = PromptTemplate(
    template="""You are a professional travel planner.
    Create a detailed daily itinerary for a trip to {destination}.
    Also, recommend 3-4 must-visit attractions in {destination} with brief descriptions.
    
    Consider the following preferences:
    {preferences}
    
    Use the following research data to ensure accuracy (opening hours, popular spots, events):
    {research_data}
    
    Return the result strictly in the following JSON format.
    {format_instructions}
    
    Example format:
    {{
        "itinerary": [
            {{
                "day": 1,
                "theme": "Arrival and Exploration",
                "activities": [
                    {{
                        "time": "10:00 AM",
                        "activity": "Check-in",
                        "description": "Arrive at hotel"
                    }}
                ]
            }}
        ],
        "attractions": [
            {{
                "name": "Eiffel Tower",
                "description": "Iconic landmark",
                "imageUrl": ""
            }}
        ]
    }}
    
    Ensure all text fields are in Korean.
    IMPORTANT: Output ONLY the JSON object. Do not use markdown code blocks (e.g., ```json). Do not add any introductory or concluding text.
    """,
    input_variables=["destination", "preferences", "research_data"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

def fetch_image(query: str, context: str = "") -> str:
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    
    # 검색어 구체화: "{명소} {도시} landmark"
    search_query = f"{query} {context} landmark".strip()
    
    if not access_key:
        return f"https://picsum.photos/seed/{query}/800/600"
    
    url = f"https://api.unsplash.com/search/photos?query={search_query}&per_page=1&client_id={access_key}&orientation=landscape"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                return data['results'][0]['urls']['regular']
    except Exception as e:
        print(f"Error fetching image for {query}: {e}")
    
    return f"https://picsum.photos/seed/{query}/800/600"

# 노드 함수 정의
def research_activities(state: ItineraryState):
    destination = state["destination"]
    # 여행지 관련 주요 정보 검색
    query = f"must visit places and events in {destination} travel guide"
    
    try:
        results = tavily_tool.invoke({"query": query})
        research_summary = "\n".join([f"- {r['content']}" for r in results])
    except Exception as e:
        print(f"Error researching activities: {e}")
        research_summary = "No research data available."
        
    return {"research_data": research_summary}

def generate_itinerary(state: ItineraryState):
    destination = state["destination"]
    preferences = state["preferences"]
    research_data = state.get("research_data", "")
    
    chain = prompt | llm | parser
    try:
        response = chain.invoke({
            "destination": destination, 
            "preferences": preferences,
            "research_data": research_data
        })
        
        itinerary = response['itinerary']
        attractions = response.get('attractions', [])
        
        # 명소 이미지 가져오기
        for attraction in attractions:
            attraction['imageUrl'] = fetch_image(attraction['name'], context=destination)
            
        return {"itinerary": itinerary, "attractions": attractions}
    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return {"itinerary": [], "attractions": []}

# 그래프 구성
workflow = StateGraph(ItineraryState)
workflow.add_node("research_activities", research_activities)
workflow.add_node("generate_itinerary", generate_itinerary)

workflow.set_entry_point("research_activities")
workflow.add_edge("research_activities", "generate_itinerary")
workflow.add_edge("generate_itinerary", END)

itinerary_graph = workflow.compile()
