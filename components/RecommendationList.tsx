import React from 'react';
import { TripRecommendation } from '../types';
import { ArrowRight, MapPin, DollarSign } from 'lucide-react';

interface Props {
  recommendations: TripRecommendation[];
  onSelect: (trip: TripRecommendation) => void;
  onBack: () => void;
}

export const RecommendationList: React.FC<Props> = ({ recommendations, onSelect, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">당신을 위한 완벽한 여행지 3곳</h2>
          <p className="text-slate-500 mt-2">여행지를 선택하여 상세 일정을 확인하세요.</p>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium">
          처음으로
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recommendations.map((trip, idx) => (
          <div 
            key={trip.id} 
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 flex flex-col h-full"
            onClick={() => onSelect(trip)}
          >
            <div className="h-48 bg-slate-200 relative">
               <img 
                 src={`https://picsum.photos/seed/${trip.destination}/600/400`} 
                 alt={trip.destination}
                 className="w-full h-full object-cover"
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-700 uppercase tracking-wide">
                 옵션 {idx + 1}
               </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{trip.destination}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {trip.country}
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                {trip.reasonForRecommendation}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-sm font-medium p-3 bg-slate-50 rounded-lg">
                   <span className="text-slate-500">예상 비용</span>
                   <span className="text-teal-700 flex items-center">
                     <DollarSign size={14} className="mr-1" />
                     {trip.estimatedTotalCost}
                   </span>
                </div>

                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium flex items-center justify-center group hover:bg-slate-800 transition">
                  상세 일정 보기
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};