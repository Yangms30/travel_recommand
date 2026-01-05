from fastapi import APIRouter, HTTPException
from app.models.schemas import TravelRequest, ItineraryRequest
from app.agents.destination_agent import destination_graph
from app.agents.itinerary_agent import itinerary_graph

router = APIRouter()

@router.post("/recommend/destinations")
async def recommend_destinations(request: TravelRequest):
    try:
        # LangGraph 실행 (invoke)
        result = await destination_graph.ainvoke({"user_input": request.dict()})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommend/itinerary")
async def recommend_itinerary(request: ItineraryRequest):
    try:
        # LangGraph 실행 (invoke)
        result = await itinerary_graph.ainvoke({
            "destination": request.destination, 
            "duration": request.duration,
            "preferences": request.preferences
        })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
