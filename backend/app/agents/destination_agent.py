import os
import requests
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain_tavily import TavilySearch

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
    weather: str = Field(description="날씨 정보", default="")

class RecommendationsOutput(BaseModel):
    recommendations: List[Recommendation]

# 상태 정의
class DestinationState(TypedDict):
    user_input: dict
    research_data: str
    recommendations: List[dict]

# LLM 설정
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# 도구 설정
tavily_tool = TavilySearch(max_results=2)

# 파서 설정
parser = JsonOutputParser(pydantic_object=RecommendationsOutput)

# 프롬프트 템플릿 (토큰 최적화)
prompt = PromptTemplate(
    template="""Recommend 3 travel destinations based on user preferences and research data.

[User Preferences]
{user_input}

[Research Data]
{research_data}

Constraints:
1. If 'preferredDestination' specified: ONLY recommend that city or close variations (e.g., Tokyo → Tokyo City Center, Tokyo & Yokohama)
2. Short trips (3-4 days): Single city. Long trips (7+ days): Multi-city OK
3. Multi-city format: "City1 & City2"

All text in Korean. Output ONLY valid JSON, no markdown.

{format_instructions}""",
    input_variables=["user_input", "research_data"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

def get_primary_city(destination: str) -> str:
    # "Paris & London", "Osaka -> Kyoto", "Paris, France" 등에서 첫 번째 주요 도시 추출
    separators = ["&", "->", ",", "+", " and ", " - "]
    primary = destination
    for sep in separators:
        if sep in primary:
            primary = primary.split(sep)[0]
    return primary.strip()

def fetch_destination_image(destination: str) -> str:
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    query_city = get_primary_city(destination)
    
    if not access_key:
        return f"https://picsum.photos/seed/{query_city}/800/600"
    
    # 다중 검색 전략: 구체적인 쿼리부터 시도
    search_queries = [
        f"{query_city} skyline cityscape",  # 도시 스카이라인
        f"{query_city} famous landmark architecture",  # 유명 랜드마크
        f"{query_city} travel destination",  # 여행지
    ]
    
    for search_query in search_queries:
        url = f"https://api.unsplash.com/search/photos?query={search_query}&per_page=3&client_id={access_key}&orientation=landscape"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data['results']:
                    # 첫 번째 결과 반환 (가장 관련성 높음)
                    return data['results'][0]['urls']['regular']
        except Exception as e:
            print(f"Error fetching image for {destination} with query '{search_query}': {e}")
            continue
    
    return f"https://picsum.photos/seed/{query_city}/800/600"

def fetch_weather_info(destination: str) -> str:
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return "날씨 정보 없음"
    
    query_city = get_primary_city(destination)
        
    # 1. 도시 좌표(위도/경도) 가져오기
    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={query_city}&limit=1&appid={api_key}"
    try:
        geo_res = requests.get(geo_url, timeout=5)
        if geo_res.status_code == 200 and geo_res.json():
            lat = geo_res.json()[0]['lat']
            lon = geo_res.json()[0]['lon']
            
            # 2. 현재 날씨 가져오기 (섭씨)
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=kr"
            weather_res = requests.get(weather_url, timeout=5)
            if weather_res.status_code == 200:
                data = weather_res.json()
                temp = round(data['main']['temp'])
                desc = data['weather'][0]['description']
                return f"{desc}, {temp}°C"
    except Exception as e:
        print(f"Error fetching weather for {destination}: {e}")
        
    return "날씨 정보 없음"

# 노드 함수 정의
def research_destinations(state: DestinationState):
    user_input = state["user_input"]
    # 사용자 입력을 바탕으로 검색 쿼리 생성 (간단히 구현)
    # 실제로는 LLM을 이용해 쿼리를 생성하는 것이 더 좋음
    query = f"best travel destinations for {user_input.get('travelers', 'travelers')} in {user_input.get('startDate', 'upcoming months')} style {user_input.get('travelStyles', 'general')}"
    
    try:
        results = tavily_tool.invoke({"query": query})
        # 결과 요약
        research_summary = "\n".join([f"- {r['content']}" for r in results])
    except Exception as e:
        print(f"Error searching destinations: {e}")
        research_summary = "No research data available."
        
    return {"research_data": research_summary}

def generate_recommendations(state: DestinationState):
    user_input = state["user_input"]
    research_data = state.get("research_data", "")
    
    chain = prompt | llm | parser
    try:
        response = chain.invoke({"user_input": user_input, "research_data": research_data})
        recommendations = response['recommendations']
        
        # 이미지 및 날씨 URL 추가
        for rec in recommendations:
            rec['imageUrl'] = fetch_destination_image(rec['destination'])
            rec['weather'] = fetch_weather_info(rec['destination'])
            
        return {"recommendations": recommendations}
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {"recommendations": []}

# 그래프 구성
workflow = StateGraph(DestinationState)
workflow.add_node("research_destinations", research_destinations)
workflow.add_node("generate_recommendations", generate_recommendations)

workflow.set_entry_point("research_destinations")
workflow.add_edge("research_destinations", "generate_recommendations")
workflow.add_edge("generate_recommendations", END)

destination_graph = workflow.compile()
