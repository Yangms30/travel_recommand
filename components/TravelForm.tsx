import React, { useState, useEffect } from 'react';
import { TravelPreferences, CompanionType } from '../types';

interface Props {
  onSubmit: (prefs: TravelPreferences) => void;
  onBack?: () => void;
}

export const TravelForm: React.FC<Props> = ({ onSubmit, onBack }) => {
  // Detailed state for the new UI
  const [destination, setDestination] = useState('');
  
  // Date State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Travelers breakdown
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [companion, setCompanion] = useState<CompanionType>(CompanionType.Solo);

  // Budget
  const [budget, setBudget] = useState(1000000); // Default ~ $1000 equivalent
  const [currency, setCurrency] = useState('KRW');

  // Preferences
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Derived state for UI
  const isUndecided = destination === 'AI가 추천해주는 최고의 여행지';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("여행 날짜를 선택해주세요.");
      return;
    }

    // Construct the final preferences object
    const finalTravelers = adults + children;
    
    // Append extra details to special requests
    let extraDetails = `\n[상세 정보]\n성인: ${adults}명, 아동: ${children}명, 반려동물: ${pets}마리`;
    if (travelStyles.length > 0) {
      extraDetails += `\n선호 스타일: ${travelStyles.join(', ')}`;
    }

    const prefs: TravelPreferences = {
      startDate,
      endDate,
      travelers: finalTravelers,
      budgetPerPerson: budget,
      currency,
      companion,
      preferredDestination: destination,
      specialRequests: specialRequests + extraDetails,
      travelStyles: travelStyles // Added this
    };

    onSubmit(prefs);
  };

  const toggleStyle = (style: string) => {
    setTravelStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style) 
        : [...prev, style]
    );
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Adjust for timezone offset to ensure YYYY-MM-DD matches local selection
    const dateString = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    if (!startDate || (startDate && endDate)) {
      setStartDate(dateString);
      setEndDate('');
    } else {
      // Check if selected date is before start date
      if (new Date(dateString) < new Date(startDate)) {
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return startDate === dateString || endDate === dateString;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return dateString > startDate && dateString < endDate;
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const selected = isSelected(i);
      const inRange = isInRange(i);
      const past = isPastDate(i);
      
      let buttonClass = "h-9 w-9 mx-auto flex items-center justify-center text-sm rounded-full transition-all relative z-10 ";
      
      if (past) {
        buttonClass += "text-slate-300 cursor-not-allowed ";
      } else if (selected) {
        buttonClass += "bg-primary text-white font-bold shadow-md shadow-primary/30 ";
      } else if (inRange) {
        buttonClass += "bg-primary/10 text-slate-900 ";
      } else {
        buttonClass += "text-slate-700 hover:bg-slate-100 ";
      }

      // Connector line for range visual
      const isStart = startDate && new Date(startDate).getDate() === i && new Date(startDate).getMonth() === currentMonth.getMonth();
      const isEnd = endDate && new Date(endDate).getDate() === i && new Date(endDate).getMonth() === currentMonth.getMonth();
      
      days.push(
        <div key={i} className="relative h-10 w-full flex items-center justify-center">
           {inRange && !past && (
             <div className="absolute inset-y-0.5 left-0 right-0 bg-primary/10 z-0"></div>
           )}
           {/* Visual connectors for start/end to range */}
           {isStart && endDate && (
             <div className="absolute inset-y-0.5 right-0 w-1/2 bg-primary/10 z-0 rounded-l-full"></div>
           )}
           {isEnd && startDate && (
             <div className="absolute inset-y-0.5 left-0 w-1/2 bg-primary/10 z-0 rounded-r-full"></div>
           )}
           
          <button 
            type="button"
            onClick={() => !past && handleDateClick(i)}
            disabled={past}
            className={buttonClass}
          >
            {i}
          </button>
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  // Calculate duration strings
  const getDurationString = () => {
    if (!startDate || !endDate) return "날짜를 선택해주세요";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}박 ${diffDays + 1}일`;
  };

  return (
    <div className="flex flex-col max-w-[960px] w-full gap-8 mx-auto">
      {/* Hero / Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">완벽한 여행을 계획해보세요</h1>
          <p className="text-slate-500 text-lg font-normal leading-normal">
            AI가 당신만을 위한 최적의 여행 코스를 설계해 드립니다. <br className="hidden md:block"/>몇 가지 간단한 질문에 답하고 나만의 여정을 시작하세요.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
          <span>AI 기반 여행 플래너</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Destination Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-900 text-xl font-bold leading-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span> 여행지
            </h3>
            <div className="flex flex-col gap-4">
              
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-semibold text-slate-700 block">어디로 떠나시나요?</span>
                <button 
                  type="button"
                  onClick={() => setDestination(isUndecided ? '' : 'AI가 추천해주는 최고의 여행지')}
                  className={`text-xs font-bold flex items-center gap-1 transition-colors ${isUndecided ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  {isUndecided ? '직접 입력하기' : '아직 못 정했어요 (AI 추천)'}
                </button>
              </div>

              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined transition-colors ${isUndecided ? 'text-primary' : 'text-slate-400'}`}>
                  {isUndecided ? 'auto_awesome' : 'search'}
                </span>
                <input 
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all ${isUndecided ? 'border-primary/50 bg-primary/5 text-primary' : 'border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  placeholder="도시, 국가 또는 지역 검색 (예: 파리, 일본)" 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  readOnly={isUndecided}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-1">인기 여행지:</span>
                {['서울', '제주도', '도쿄', '뉴욕', '파리'].map(city => (
                  <button 
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Dates Section (Calendar) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-900 text-xl font-bold leading-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_month</span> 여행 일정
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar Grid */}
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4 px-2">
                  <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
                  </button>
                  <span className="font-bold text-slate-900">
                    {currentMonth.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-y-1 mb-2">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>
                  ))}
                  {renderCalendarDays()}
                </div>

                <div className="mt-4 flex justify-between items-center px-2 border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500 font-medium">
                    {startDate && endDate ? getDurationString() : '날짜를 선택하세요'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    날짜 초기화
                  </button>
                </div>
              </div>

              {/* Selected Dates Display */}
              <div className="flex flex-col justify-center gap-4 w-full md:w-auto min-w-[200px]">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">출발일</span>
                  <span className="text-lg font-bold text-slate-900 block truncate">
                    {startDate ? formatDateDisplay(startDate) : "날짜 선택"}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">도착일</span>
                   <span className="text-lg font-bold text-slate-900 block truncate">
                     {endDate ? formatDateDisplay(endDate) : "날짜 선택"}
                   </span>
                </div>
              </div>
            </div>
          </section>

          {/* Travelers & Companion Type */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-900 text-xl font-bold leading-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span> 여행 인원
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Companion Type */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-slate-700">누구와 함께 하시나요?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: CompanionType.Solo, icon: 'person', label: '혼자' },
                    { type: CompanionType.Couple, icon: 'favorite', label: '연인/부부' },
                    { type: CompanionType.Family, icon: 'family_restroom', label: '가족' },
                    { type: CompanionType.Friends, icon: 'diversity_3', label: '친구' }
                  ].map((item) => (
                    <label key={item.type} className="cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="companion" 
                        className="peer sr-only"
                        checked={companion === item.type}
                        onChange={() => setCompanion(item.type)}
                      />
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all h-full hover:bg-slate-100">
                        <span className="material-symbols-outlined mb-2">{item.icon}</span>
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary scale-0 peer-checked:scale-100 transition-all">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Counts */}
              <div className="flex flex-col gap-4 justify-center">
                {/* Adults */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900">성인</span>
                    <span className="text-xs text-slate-500">만 13세 이상</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-4 text-center font-bold text-slate-900">{adults}</span>
                    <button 
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                
                {/* Children */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900">아동</span>
                    <span className="text-xs text-slate-500">만 2세 ~ 12세</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-4 text-center font-bold text-slate-900">{children}</span>
                    <button 
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>

                {/* Pets */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900">반려동물</span>
                    <span className="text-xs text-slate-500">함께 여행하는 반려동물</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setPets(Math.max(0, pets - 1))}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-4 text-center font-bold text-slate-900">{pets}</span>
                    <button 
                      type="button"
                      onClick={() => setPets(pets + 1)}
                      className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-900 text-xl font-bold leading-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span> 여행 취향
            </h3>
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">선호하는 여행 스타일</label>
                <div className="flex flex-wrap gap-2">
                  {['휴식', '모험', '맛집 탐방', '문화/예술', '쇼핑'].map(style => (
                    <label key={style} className="cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={travelStyles.includes(style)}
                        onChange={() => toggleStyle(style)}
                      />
                      <div className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 bg-slate-50 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                        {style}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">특별 요청사항</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 placeholder:text-slate-400 font-medium transition-all resize-none" 
                  placeholder="휠체어 접근성이 필요해요, 박물관을 좋아해요 등 AI에게 알려주고 싶은 내용을 자유롭게 적어주세요." 
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Summary & Submit */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Budget Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-900 text-lg font-bold leading-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">payments</span> 예산 범위
            </h3>
            <p className="text-sm text-slate-500 mb-6">항공편을 제외한 1인당 예상 예산입니다.</p>
            <div className="flex flex-col gap-6">
              <div className="relative pt-1">
                <div className="relative">
                  <input 
                    type="text"
                    value={budget.toLocaleString()}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setBudget(val ? parseInt(val) : 0);
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold text-lg text-slate-900 pr-16 text-right"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">{currency}</span>
                </div>
              </div>
              


              <div className="mt-2">
                 <label className="text-sm font-semibold text-slate-700 mb-1 block">통화</label>
                 <select 
                   value={currency}
                   onChange={(e) => setCurrency(e.target.value)}
                   className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                 >
                   <option value="KRW">KRW (₩)</option>
                   <option value="USD">USD ($)</option>
                   <option value="EUR">EUR (€)</option>
                   <option value="JPY">JPY (¥)</option>
                 </select>
              </div>
            </div>
          </div>

          {/* Sticky Action Area */}
          <div className="sticky top-24 flex flex-col gap-4">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h4 className="font-bold text-slate-900 mb-2">여행 요약</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-500">기간</span>
                  <span className="font-semibold text-slate-700">{getDurationString()}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">인원</span>
                  <span className="font-semibold text-slate-700">{adults + children}명 ({companion})</span>
                </li>
                {pets > 0 && (
                  <li className="flex justify-between">
                    <span className="text-slate-500">반려동물</span>
                    <span className="font-semibold text-slate-700">{pets}마리</span>
                  </li>
                )}
                <li className="flex justify-between">
                  <span className="text-slate-500">예상 예산</span>
                  <span className="font-semibold text-primary">{budget.toLocaleString()} {currency}</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>여행 일정 생성하기</span>
            </button>
            <p className="text-center text-xs text-slate-400 px-4">
              AI가 생성한 일정은 참고용이며, 정확한 정보는 예약 시 반드시 다시 확인하시기 바랍니다.
            </p>
            
            {onBack && (
               <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 text-center">
                 메인으로 돌아가기
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};