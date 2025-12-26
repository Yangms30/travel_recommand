from pydantic import BaseModel
from typing import List, Optional

class TravelRequest(BaseModel):
    preferences: str
    duration: str
    budget: str
    # 필요한 필드 추가 가능

class ItineraryRequest(BaseModel):
    destination: str
    preferences: str
    duration: str
    # 필요한 필드 추가 가능
