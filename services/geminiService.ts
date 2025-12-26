import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelPreferences, TripRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          country: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          reasonForRecommendation: { type: Type.STRING },
          estimatedTotalCost: { type: Type.STRING, description: "요청된 통화로 된 예상 총 비용" },
          flightSuggestion: { type: Type.STRING, description: "항공편에 대한 간략한 제안 (예: '인천 출발 직항 추천')" },
          hotelSuggestion: { type: Type.STRING, description: "숙소 유형에 대한 간략한 제안" },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                theme: { type: Type.STRING, description: "그 날의 테마 (예: '시티 투어', '휴식')" },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING, description: "오전, 오후, 저녁 또는 구체적인 시간" },
                      activity: { type: Type.STRING },
                      description: { type: Type.STRING },
                    }
                  }
                }
              }
            }
          }
        },
        required: ["destination", "country", "shortDescription", "reasonForRecommendation", "estimatedTotalCost", "itinerary"]
      }
    }
  }
};

export const generateTravelPlan = async (prefs: TravelPreferences): Promise<TripRecommendation[]> => {
  const duration = Math.ceil((new Date(prefs.endDate).getTime() - new Date(prefs.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `
    당신은 전문 여행 상담사입니다. 한국어로 응답해주세요.
    다음 조건에 맞춰 ${prefs.travelers}명을 위한 여행을 계획해주세요.
    
    동행 유형: ${prefs.companion}.
    1인당 예산: ${prefs.budgetPerPerson} ${prefs.currency}.
    여행 날짜: ${prefs.startDate} 부터 ${prefs.endDate} 까지 (${duration}일간).
    희망 여행지: ${prefs.preferredDestination || "추천해주세요"}.
    특별 요청사항: ${prefs.specialRequests || "없음"}.

    위 정보를 바탕으로 서로 다른 매력을 가진 여행지 3곳을 추천해주세요.
    각 여행지에 대해 ${duration}일 간의 상세한 일자별 여행 일정을 제공해야 합니다.
    
    일정은 현실적이어야 하며, 동행 유형(예: 부모님 동반 시 걷는 일정 최소화, 연인 동반 시 로맨틱한 장소 등)을 고려하고 예산 범위 내에서 작성해주세요.
    
    **중요: 모든 응답 텍스트(설명, 활동 내용, 이유 등)는 반드시 한국어로 작성해주세요.**
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        systemInstruction: "당신은 AI 에이전트를 활용하여 최적의 여행 경로와 정보를 찾아주는 세계 최고의 여행 플래너입니다. 모든 답변은 한국어로 제공합니다.",
      },
    });

    const jsonResponse = JSON.parse(response.text || "{}");
    
    if (jsonResponse.recommendations) {
      return jsonResponse.recommendations.map((rec: any, index: number) => ({
        ...rec,
        id: `trip-${index}-${Date.now()}`
      }));
    }
    
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw error;
  }
};