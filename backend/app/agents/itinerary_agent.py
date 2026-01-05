import os
import asyncio
import requests
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from tavily import TavilyClient
from langchain_google_community import GooglePlacesTool

load_dotenv()

# 데이터 모델 정의
class ItineraryActivity(BaseModel):
    time: str = Field(description="시간 (예: 오전 10:00)")
    activity: str = Field(description="활동 명")
    description: str = Field(description="활동 설명")

class Meal(BaseModel):
    name: str = Field(description="식당 이름")
    description: str = Field(description="식당 설명 및 추천 메뉴")
    google_maps_link: str = Field(description="Google Maps 링크 (실제 URL 또는 검색 링크)")

class ItineraryDay(BaseModel):
    day: int = Field(description="일차 (1, 2, 3...)")
    theme: str = Field(description="그 날의 테마")
    activities: List[ItineraryActivity]
    meals: List[Meal] = Field(description="점심, 저녁 식사 추천")

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
    duration: str
    preferences: str
    research_data: str
    itinerary: List[dict]
    attractions: List[dict]

# LLM 설정
llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

# 도구 설정
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# 파서 설정
parser = JsonOutputParser(pydantic_object=ItineraryOutput)

# 프롬프트 템플릿 (토큰 최적화)
prompt = PromptTemplate(
    template="""Create a detailed daily itinerary for {destination}.

Duration: {duration}
Preferences: {preferences}

Research data: {research_data}

CRITICAL REQUIREMENTS:
- You MUST create a complete itinerary for ALL {duration} days
- Create exactly {duration} day entries in the itinerary array
- Number each day from 1 to {duration}
- Each day must have activities and meal recommendations
- Recommend 3-4 must-visit attractions with brief descriptions
- For each day, suggest lunch and dinner spots with Google Maps links (format: https://www.google.com/maps/search/?api=1&query={{Name}}+{{City}})
- All text in Korean
- Output ONLY valid JSON, no markdown blocks

{format_instructions}""",
    input_variables=["destination", "duration", "preferences", "research_data"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

def fetch_image(query: str, context: str = "") -> str:
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    
    if not access_key:
        return f"https://picsum.photos/seed/{query}/800/600"
    
    # 명소 이미지 검색: 다중 검색 전략
    search_queries = [
        f"{query} {context} landmark architecture",  # 명소 + 도시 + 건축물
        f"{query} famous tourist attraction",  # 유명 관광 명소
        f"{query} {context}",  # 명소 + 도시
    ]
    
    for search_query in search_queries:
        url = f"https://api.unsplash.com/search/photos?query={search_query.strip()}&per_page=3&client_id={access_key}&orientation=landscape"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data['results']:
                    return data['results'][0]['urls']['regular']
        except Exception as e:
            print(f"Error fetching image for {query} with query '{search_query}': {e}")
            continue
    
    return f"https://picsum.photos/seed/{query}/800/600"

# 노드 함수 정의
async def research_activities(state: ItineraryState):
    destination = state["destination"]
    
    async def fetch_tavily():
        try:
            tavily_query = f"must visit places and events in {destination} travel guide"
            response = tavily_client.search(tavily_query, max_results=2)
            tavily_results = response.get('results', [])
            return ["[General Info]"] + [f"- {r['content']}" for r in tavily_results]
        except Exception as e:
            print(f"Error researching activities with Tavily: {e}")
            return []

    async def fetch_places():
        try:
            places_tool = GooglePlacesTool()
            places_query = f"popular restaurants in {destination}"
            places_results = await places_tool.ainvoke(places_query)
            return ["\n[Restaurant Info]", places_results]
        except Exception as e:
            print(f"Error researching restaurants with Google Places: {e}")
            # Fallback to Tavily
            try:
                fallback_query = f"best restaurants in {destination} with google maps links"
                fallback_response = tavily_client.search(fallback_query, max_results=2)
                fallback_results = fallback_response.get('results', [])
                return ["\n[Restaurant Info (Fallback)]"] + [f"- {r['content']}" for r in fallback_results]
            except Exception as inner_e:
                 print(f"Error researching restaurants with fallback: {inner_e}")
                 return []

    # Execute in parallel
    results = await asyncio.gather(fetch_tavily(), fetch_places())
    
    flat_results = []
    for r in results:
        flat_results.extend(r)

    # 토큰 절감: Research 데이터 요약 (각 항목을 150자로 제한)
    summarized_results = []
    for item in flat_results:
        if len(item) > 150:
            summarized_results.append(item[:150] + "...")
        else:
            summarized_results.append(item)

    return {"research_data": "\n".join(summarized_results)}

async def generate_itinerary(state: ItineraryState):
    destination = state["destination"]
    duration = state["duration"]
    preferences = state["preferences"]
    research_data = state.get("research_data", "")
    
    chain = prompt | llm | parser
    try:
        response = await chain.ainvoke({
            "destination": destination,
            "duration": duration,
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
