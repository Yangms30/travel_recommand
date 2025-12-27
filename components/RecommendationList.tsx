import React from 'react';
import { TripRecommendation, TravelPreferences } from '../types';

interface Props {
  recommendations: TripRecommendation[];
  onSelect: (trip: TripRecommendation) => void;
  onBack: () => void;
  prefs: TravelPreferences | null;
}

export const RecommendationList: React.FC<Props> = ({ recommendations, onSelect, onBack, prefs }) => {
  // Helper to format date duration
  const getDurationText = () => {
    if (!prefs) return "3박 4일"; // Fallback
    const start = new Date(prefs.startDate);
    const end = new Date(prefs.endDate);
    const diff = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff}박 ${diff + 1}일`;
  };

  const getBudgetText = () => {
      if(!prefs) return "예산 미정";
      // Format number to '200만원' style if KRW, else normal
      if (prefs.currency === 'KRW') {
          return `예산 ${(prefs.budgetPerPerson / 10000).toLocaleString()}만원`;
      }
      return `예산 ${prefs.budgetPerPerson.toLocaleString()} ${prefs.currency}`;
  }

  const getStyleTag = () => {
      if (!prefs || !prefs.travelStyles || prefs.travelStyles.length === 0) return "자유 여행";
      return `${prefs.travelStyles[0]} 여행`;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Page Heading & Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            AI가 추천하는 당신만의 여행지
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span> {getDurationText()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="material-symbols-outlined text-[16px]">spa</span> {getStyleTag()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
              <span className="material-symbols-outlined text-[16px]">attach_money</span> {getBudgetText()}
            </span>
          </div>
        </div>
        
        <button onClick={onBack} className="text-slate-500 hover:text-slate-900 font-medium text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">refresh</span> 조건 변경하기
        </button>
      </div>

      {/* AI Insight Message */}
      <div className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
        <div className="shrink-0 flex flex-col items-center gap-3 md:w-48">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900">AI 여행 비서</p>
            <p className="text-xs text-slate-500 mt-1">맞춤형 분석 완료</p>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-50 rounded-xl p-5 md:p-6 border border-slate-100 relative">
          <div className="absolute top-6 left-0 w-3 h-3 bg-slate-50 transform -translate-x-1/2 rotate-45 border-l border-b border-slate-100 hidden md:block"></div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            고객님을 위한 추천 포인트
          </h3>
          
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900 mr-2">{rec.destination}</span>
                  <span className="text-slate-600 text-sm leading-relaxed">{rec.shortDescription}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-4 text-right">
            * 각 카드를 클릭하여 상세 일정과 예산을 확인하세요.
          </p>
        </div>
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((trip) => (
            <div key={trip.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 h-full cursor-pointer" onClick={() => onSelect(trip)}>
                <div className="relative h-60 overflow-hidden">
                    <img 
                        src={trip.imageUrl || `https://picsum.photos/seed/${trip.destination}/800/600`}
                        alt={trip.destination}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full text-slate-900 shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-blue-500">beach_access</span> 추천
                        </span>
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{trip.destination}</h3>
                            <p className="text-sm text-slate-500">{trip.country}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-medium text-slate-400">예산</span>
                            <span className="text-sm font-bold text-slate-700">{trip.estimatedTotalCost}</span>
                        </div>
                    </div>
                    
                    <div className="h-px bg-slate-100 my-4"></div>
                    
                    <div className="space-y-3 mb-6 flex-1">
                        {trip.itinerary.slice(0, 3).map((day) => (
                            <div key={day.day} className="flex gap-3 text-sm text-slate-600">
                                <span className="w-12 shrink-0 font-semibold text-slate-400">{day.day}일차</span>
                                <p className="line-clamp-1">{day.theme}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                            <span className="material-symbols-outlined text-[18px]">sunny</span> {trip.weather || "날씨 정보 없음"}
                        </div>
                        <button className="bg-primary hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
                            자세히 보기 <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};