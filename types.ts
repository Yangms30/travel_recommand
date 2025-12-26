export enum CompanionType {
  Solo = '혼자',
  Couple = '연인/부부',
  Family = '가족',
  Friends = '친구',
  Parents = '부모님 (효도여행)',
  Other = '기타'
}

export interface TravelPreferences {
  startDate: string;
  endDate: string;
  travelers: number;
  budgetPerPerson: number;
  currency: string;
  companion: CompanionType;
  preferredDestination: string;
  specialRequests: string;
  travelStyles?: string[];
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface TripRecommendation {
  id: string;
  destination: string;
  country: string;
  shortDescription: string;
  reasonForRecommendation: string;
  estimatedTotalCost: string;
  flightSuggestion: string;
  hotelSuggestion: string;
  itinerary: ItineraryDay[];
  imageUrl?: string;
}

export type AppStep = 'LANDING' | 'INPUT' | 'LOADING' | 'RESULTS' | 'DETAIL';