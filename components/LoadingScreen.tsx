import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const loadingMessages = [
    "여행지 정보를 꼼꼼히 살피는 중...",
    "현지인만 아는 맛집을 찾는 중...",
    "최적의 이동 경로를 계산하는 중...",
    "날씨 정보를 확인하는 중...",
    "당신만을 위한 특별한 일정을 만드는 중...",
    "숨겨진 명소를 탐색하는 중..."
  ];

  const travelTips = [
    "비행기 티켓은 출발 6주 전에 예매하면 평균적으로 가장 저렴하다는 사실, 알고 계셨나요?",
    "현지 시장을 방문하면 그 나라의 진짜 문화를 경험할 수 있어요.",
    "여행자 보험은 선택이 아닌 필수! 혹시 모를 상황에 대비하세요.",
    "구글 맵 오프라인 지도를 미리 다운로드하면 데이터 없이도 길을 찾을 수 있어요.",
    "현지 언어로 '안녕하세요', '감사합니다' 정도는 익혀두면 좋아요."
  ];

  useEffect(() => {
    // Progress Bar Logic: 90%까지는 빠르게, 그 이후는 천천히
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev < 99 ? prev + 0.1 : 99;
        }
        return prev + (Math.random() * 2); // Random increment for natural feel
      });
    }, 150);

    // Message Rotation
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    // Tip Rotation
    const tipTimer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % travelTips.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
      clearInterval(tipTimer);
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[640px] items-center justify-center py-12 px-4 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-9xl text-primary transform -rotate-12">flight_takeoff</span>
      </div>
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-9xl text-primary transform rotate-12">map</span>
      </div>

      <div className="flex flex-col w-full flex-1 justify-center z-10">
        {/* Central Visual */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center relative animate-pulse">
              {/* Inner circle suggesting pulsing radar */}
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center absolute">
                <span className="material-symbols-outlined text-6xl text-primary">globe_asia</span>
              </div>
              {/* Orbiting dot static representation (could be animated with CSS if desired) */}
              <div className="absolute top-2 right-8 w-3 h-3 bg-primary rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>
            <div className="absolute -bottom-2 right-0 bg-white p-2 rounded-lg shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="material-symbols-outlined text-amber-500">light_mode</span>
              <span className="text-xs font-bold text-slate-600">날씨 체크 중...</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-10">
          <h1 className="text-slate-900 tracking-tight text-3xl md:text-4xl font-bold leading-tight px-4 pb-3">
            AI가 최적의 여행지를<br />찾는 중입니다...
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-normal leading-normal px-4">
            고객님의 취향과 예산을 분석하여<br className="md:hidden" /> 가장 완벽한 여정을 계획하고 있습니다.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-3 p-4 w-full bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-6 justify-between items-end">
            <div className="flex flex-col gap-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">현재 진행 상황</p>
              <p className="text-slate-900 text-base font-semibold leading-normal flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm animate-spin">auto_awesome</span>
                {loadingMessages[currentMessageIndex]}
              </p>
            </div>
            <p className="text-primary text-xl font-bold leading-normal">{Math.round(progress)}%</p>
          </div>
          <div className="rounded-full bg-slate-100 h-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary relative transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            >
              <div 
                className="absolute inset-0 bg-white/20 w-full h-full" 
                style={{ 
                  backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', 
                  backgroundSize: '1rem 1rem' 
                }}
              ></div>
            </div>
          </div>
          </div>


        {/* Long Itinerary Notice */}
        <div className="mt-6 text-center px-4 animate-fade-in">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 bg-slate-50 py-2 px-4 rounded-full inline-flex border border-slate-100">
            <span className="material-symbols-outlined text-sm text-slate-400">info</span>
            여행 기간이 길수록 더 꼼꼼한 계획을 위해 시간이 조금 더 소요될 수 있습니다.
          </p>
        </div>

        {/* Tip Card */}
        <div className="mt-8 mx-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 flex gap-4 items-start">
            <div className="bg-white p-2 rounded-full shrink-0 shadow-sm text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">여행 꿀팁</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {travelTips[currentTipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};