from dotenv import load_dotenv
import os

# 환경 변수 로드 (가장 먼저 실행)
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="Travel Recommendation AI Backend")

# CORS 설정
origins = [
    "http://localhost:5173",  # Vite 기본 포트
    "http://localhost:3000",  # React 기본 포트 (혹시 모를 대비)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Travel Recommendation AI Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
