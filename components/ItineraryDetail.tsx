import React from 'react';
import { TripRecommendation, TravelPreferences } from '../types';
import toast from 'react-hot-toast';

interface Props {
  trip: TripRecommendation;
  prefs: TravelPreferences;
  onBack: () => void;
}

export const ItineraryDetail: React.FC<Props> = ({ trip, prefs, onBack }) => {
  
  // Helper for YYMMDD format
  const toYYMMDD = (dateStr: string) => {
    return dateStr.replace(/-/g, '').slice(2);
  };

  // Dynamic links with dates
  // Skyscanner query format handles Korean city names better than path format
  const flightLink = `https://www.skyscanner.co.kr/transport/flights?origin=ICN&destination=${encodeURIComponent(trip.destination)}&outboundDate=${toYYMMDD(prefs.startDate)}&inboundDate=${toYYMMDD(prefs.endDate)}`;
  
  const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}&checkin=${prefs.startDate}&checkout=${prefs.endDate}&group_adults=${prefs.travelers}`;
  const agodaLink = `https://www.agoda.com/search?text=${encodeURIComponent(trip.destination)}&checkIn=${prefs.startDate}&checkOut=${prefs.endDate}&adults=${prefs.travelers}&rooms=1`;

  // Date formatting
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const calculateDuration = () => {
    const start = new Date(prefs.startDate);
    const end = new Date(prefs.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration();

  const [currentAttractionIndex, setCurrentAttractionIndex] = React.useState(0);

  const nextAttraction = () => {
    if (!trip.attractions) return;
    setCurrentAttractionIndex((prev) => (prev + 1) % trip.attractions!.length);
  };

  const prevAttraction = () => {
    if (!trip.attractions) return;
    setCurrentAttractionIndex((prev) => (prev - 1 + trip.attractions!.length) % trip.attractions!.length);
  };

  return (
    <div className="w-full flex flex-col items-center py-4 md:py-8 w-full">
      <div className="w-full max-w-[960px] flex flex-col gap-8">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="self-start flex items-center text-slate-500 hover:text-primary font-medium transition-colors mb-2"
        >
          <span className="material-symbols-outlined mr-1 text-lg">arrow_back</span>
          추천 목록으로 돌아가기
        </button>

        {/* Page Heading & Meta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900">
              {trip.destination} 여행을 떠날 준비 되셨나요?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm md:text-base font-normal">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">calendar_month</span> 
                {formatDate(prefs.startDate)} - {formatDate(prefs.endDate)}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">schedule</span> 
                {duration}박 {duration + 1}일
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">group</span> 
                여행자 {prefs.travelers}명
              </span>
            </div>
          </div>
          {/* Status Badge */}
          <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider self-start md:self-auto border border-amber-200">
             예약 대기 중
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-sm text-primary">AI 여행 팁</h3>
            <p className="text-sm text-slate-700">
              {trip.flightSuggestion} {trip.reasonForRecommendation}
            </p>
          </div>
        </div>

        {/* Estimated Costs (Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined">payments</span>
              <p className="text-sm font-medium uppercase tracking-wider">예상 총 경비</p>
            </div>
            <p className="text-2xl font-bold leading-tight text-slate-900">{trip.estimatedTotalCost}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined">bed</span>
              <p className="text-sm font-medium uppercase tracking-wider">추천 숙소</p>
            </div>
            <p className="text-lg font-bold leading-tight text-slate-900 line-clamp-2">{trip.hotelSuggestion}</p>
          </div>
        </div>

        {/* Major Attractions Carousel */}
        {trip.attractions && trip.attractions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">놓치면 후회할 주요 명소</h2>
              <div className="flex gap-2">
                <button 
                  onClick={prevAttraction}
                  className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button 
                  onClick={nextAttraction}
                  className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-[300px] relative overflow-hidden">
                   <img 
                     key={currentAttractionIndex} // Force re-render for animation
                     src={trip.attractions[currentAttractionIndex].imageUrl || `https://picsum.photos/seed/${trip.attractions[currentAttractionIndex].name}/800/600`} 
                     alt={trip.attractions[currentAttractionIndex].name}
                     className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                   />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-primary font-bold uppercase tracking-wider">
                    <span className="px-2 py-0.5 bg-primary/10 rounded">MUST VISIT</span>
                    <span>{currentAttractionIndex + 1} / {trip.attractions.length}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 animate-fade-in">
                    {trip.attractions[currentAttractionIndex].name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed animate-fade-in">
                    {trip.attractions[currentAttractionIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Cards Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900">예약 정보</h2>
          
          {/* Flight Card */}
          <div className="flex flex-col lg:flex-row items-stretch overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
            <div className="w-full lg:w-1/3 bg-center bg-no-repeat bg-cover min-h-[200px] lg:min-h-auto relative">
               <img 
                 src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop" 
                 alt="Airplane wing view" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-6 gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">왕복</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">서울 (ICN) <span className="text-slate-400 mx-1">↔</span> {trip.destination}</h3>
                  </div>
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">airplane_ticket</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-medium uppercase">가는 날</span>
                    <span className="text-sm font-semibold text-slate-900">{formatDate(prefs.startDate)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-medium uppercase">오는 날</span>
                    <span className="text-sm font-semibold text-slate-900">{formatDate(prefs.endDate)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a 
                  href={flightLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto cursor-pointer group flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-600 text-white px-6 py-3 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <span>스카이스캐너 검색</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Hotel Card */}
          <div className="flex flex-col lg:flex-row items-stretch overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
            <div className="w-full lg:w-1/3 bg-center bg-no-repeat bg-cover min-h-[200px] lg:min-h-auto relative">
                <img 
                 src={trip.imageUrl || `https://picsum.photos/seed/${trip.destination}hotel/800/600`}
                 alt="Hotel room" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-6 gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase">숙소</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{trip.destination} 숙소</h3>
                  </div>
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">hotel</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-slate-600">
                    {trip.hotelSuggestion}
                  </p>
                  <div className="flex items-center gap-4 text-sm mt-1 text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-primary">nights_stay</span> {duration}박</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base text-primary">person</span> {prefs.travelers}명</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a 
                  href={bookingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-[#003580] hover:bg-[#002860] text-white px-4 py-3 font-medium transition-all shadow-sm"
                >
                  <span>Booking.com</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
                <a 
                  href={agodaLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-3 font-medium transition-all shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f34f4f] inline-block"></span> Agoda
                  </span>
                  <span className="material-symbols-outlined text-[18px] opacity-60">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Snapshot */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">일정 요약</h2>
            <button 
              onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              전체 일정 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="relative pl-4 border-l-2 border-slate-200 space-y-8 py-2">
            {trip.itinerary.map((day, index) => {
              // Calculate specific date for this day
              const date = new Date(prefs.startDate);
              date.setDate(date.getDate() + (day.day - 1));
              const dateDisplay = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
              
              // Colors for the timeline dots
              const dotColor = index === 0 ? 'bg-primary' : 'bg-slate-300';

              return (
                <div key={day.day} className="relative">
                  <div className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full ${dotColor} ring-4 ring-white`}></div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{day.day}일차 • {dateDisplay}</h4>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                      <p className="font-bold text-slate-900 text-lg mb-2">{day.theme}</p>
                      <ul className="space-y-2">
                        {day.activities.slice(0, 3).map((act, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                             <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">check_circle</span>
                             <span>
                               <span className="font-semibold text-slate-800">{act.time}</span>: {act.activity}
                             </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};