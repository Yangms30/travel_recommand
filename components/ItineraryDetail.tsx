import React from 'react';
import { TripRecommendation } from '../types';
import { ArrowLeft, Plane, Hotel, Calendar, ExternalLink } from 'lucide-react';

interface Props {
  trip: TripRecommendation;
  onBack: () => void;
}

export const ItineraryDetail: React.FC<Props> = ({ trip, onBack }) => {
  
  // Generating search links dynamically based on destination
  const flightLink = `https://www.skyscanner.co.kr/transport/flights-from/kr/?destination=${encodeURIComponent(trip.destination)}`;
  const hotelLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}`;

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-slate-800 font-medium transition"
      >
        <ArrowLeft size={20} className="mr-2" /> 추천 목록으로 돌아가기
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="h-64 md:h-80 relative">
          <img 
            src={`https://picsum.photos/seed/${trip.destination}/1200/600`} 
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{trip.destination}</h1>
            <p className="text-xl text-white/90 flex items-center">
              <MapPin size={20} className="mr-2" /> {trip.country}
            </p>
          </div>
        </div>
        
        <div className="p-8 md:p-10 bg-white">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
               <h2 className="text-2xl font-bold text-slate-800 mb-4">여행 개요</h2>
               <p className="text-slate-600 leading-relaxed mb-6">{trip.shortDescription}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                   <div className="flex items-center text-teal-800 font-bold mb-2">
                     <Plane size={18} className="mr-2" /> 항공편 팁
                   </div>
                   <p className="text-sm text-teal-700">{trip.flightSuggestion}</p>
                 </div>
                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                   <div className="flex items-center text-indigo-800 font-bold mb-2">
                     <Hotel size={18} className="mr-2" /> 숙소 추천
                   </div>
                   <p className="text-sm text-indigo-700">{trip.hotelSuggestion}</p>
                 </div>
               </div>
            </div>

            {/* Booking Actions */}
            <div className="w-full md:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit sticky top-6">
              <h3 className="font-bold text-slate-800 mb-4">예약하러 가기</h3>
              <div className="space-y-3">
                <a 
                  href={flightLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl text-slate-700 transition group"
                >
                  <span className="flex items-center font-medium"><Plane size={18} className="mr-2 text-blue-500" /> 스카이스캐너</span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500" />
                </a>
                <a 
                  href={hotelLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 hover:border-blue-900 hover:shadow-md rounded-xl text-slate-700 transition group"
                >
                  <span className="flex items-center font-medium"><Hotel size={18} className="mr-2 text-blue-900" /> 부킹닷컴</span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-900" />
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                새 탭에서 열립니다. 가격은 변동될 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 ml-2">상세 여행 일정</h3>
        {trip.itinerary.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center">
              <div className="bg-teal-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md mr-4">
                {day.day}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{day.theme}</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {day.activities.map((act, i) => (
                  <div key={i} className="relative flex items-start pl-8">
                    <div className="absolute left-[13px] top-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-400 rounded-full z-10"></div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 mb-1">
                        {act.time}
                      </span>
                      <h5 className="font-bold text-slate-800 text-md">{act.activity}</h5>
                      <p className="text-slate-500 text-sm mt-1">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component for Icon
const MapPin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);