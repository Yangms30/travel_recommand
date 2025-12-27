import { TravelPreferences, TripRecommendation, ItineraryDay } from "../types";

const API_BASE_URL = "http://localhost:8000";

export const recommendDestinations = async (prefs: TravelPreferences): Promise<TripRecommendation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preferences: JSON.stringify(prefs),
        duration: `${prefs.startDate} to ${prefs.endDate}`,
        budget: `${prefs.budgetPerPerson} ${prefs.currency}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = await response.json();
    // 백엔드에서 recommendations 리스트를 반환함
    // 각 recommendation에 id가 없으므로 추가해줌
    return data.recommendations.map((rec: any, index: number) => ({
      ...rec,
      id: `trip-${index}-${Date.now()}`,
      itinerary: [], // 초기에는 일정 없음
    }));
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw error;
  }
};

export const recommendItinerary = async (destination: string, prefs: TravelPreferences): Promise<{ itinerary: ItineraryDay[], attractions: any[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend/itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: destination,
        preferences: JSON.stringify(prefs),
        duration: `${prefs.startDate} to ${prefs.endDate}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch itinerary");
    }

    const data = await response.json();
    return { 
        itinerary: data.itinerary, 
        attractions: data.attractions || [] 
    };
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    throw error;
  }
};
