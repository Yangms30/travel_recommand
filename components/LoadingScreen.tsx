import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("여행 스타일 분석 및 매칭 중...");

  useEffect(() => {
    // Simulate loading progress
    const duration = 5000; // 5 seconds total
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(newProgress);

      // Update status text based on progress
      if (newProgress < 30) {
        setStatusText("여행 스타일 분석 및 매칭 중...");
      } else if (newProgress < 60) {
        setStatusText("항공권 및 현지 숙소 데이터 검색 중...");
      } else if (newProgress < 85) {
        setStatusText("최적의 이동 경로 계산 중...");
      } else {
        setStatusText("여행 일정 최종 정리 중...");
      }

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
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
                {statusText}
              </p>
            </div>
            <p className="text-primary text-xl font-bold leading-normal">{progress}%</p>
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

        {/* Tip Card */}
        <div className="mt-8 mx-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 flex gap-4 items-start">
            <div className="bg-white p-2 rounded-full shrink-0 shadow-sm text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">여행 꿀팁</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                비행기 티켓은 출발 6주 전에 예매하면 평균적으로 가장 저렴하다는 사실, 알고 계셨나요? AI가 최적의 가격대도 함께 확인해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};