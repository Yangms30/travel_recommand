from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from dotenv import load_dotenv

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

class ItineraryOutput(BaseModel):
    itinerary: List[ItineraryDay]

# 상태 정의
class ItineraryState(TypedDict):
    destination: str
    preferences: str
    itinerary: List[dict]

# LLM 설정
llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

# 파서 설정
parser = JsonOutputParser(pydantic_object=ItineraryOutput)

# 프롬프트 템플릿
prompt = PromptTemplate(
    template="""You are a professional travel planner.
    Create a detailed daily itinerary for a trip to {destination}.
    Consider the following preferences: {preferences}
    
    Return the result strictly in the following JSON format.
    {format_instructions}
    
    Ensure all text fields are in Korean.
    """,
    input_variables=["destination", "preferences"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# 노드 함수 정의
def generate_itinerary(state: ItineraryState):
    destination = state["destination"]
    preferences = state["preferences"]
    
    chain = prompt | llm | parser
    try:
        response = chain.invoke({"destination": destination, "preferences": preferences})
        return {"itinerary": response['itinerary']}
    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return {"itinerary": []}

# 그래프 구성
workflow = StateGraph(ItineraryState)
workflow.add_node("generate_itinerary", generate_itinerary)
workflow.set_entry_point("generate_itinerary")
workflow.add_edge("generate_itinerary", END)

itinerary_graph = workflow.compile()
