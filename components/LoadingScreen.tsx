import React, { useEffect, useState } from 'react';
import { Plane, Search, Map, CheckCircle2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [1000, 2500, 4500];
    intervals.forEach((delay, index) => {
      setTimeout(() => setStage(index + 1), delay);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
        <Plane className="absolute inset-0 m-auto text-teal-500 w-10 h-10 animate-pulse" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8 animate-pulse">
        AI 에이전트가 최적의 여행지를 찾는 중입니다...
      </h2>

      <div className="w-full max-w-md space-y-4">
        <AgentStep 
          icon={<Search size={20} />} 
          text="여행 취향 및 조건 분석 중" 
          active={stage >= 0} 
          completed={stage > 0} 
        />
        <AgentStep 
          icon={<Map size={20} />} 
          text="지도 API를 통해 최고의 여행지 탐색 중" 
          active={stage >= 1} 
          completed={stage > 1} 
        />
        <AgentStep 
          icon={<Plane size={20} />} 
          text="항공편 경로 및 가능 여부 확인 중" 
          active={stage >= 2} 
          completed={stage > 2} 
        />
        <AgentStep 
          icon={<CheckCircle2 size={20} />} 
          text="3가지 추천 여행 일정 확정 중" 
          active={stage >= 3} 
          completed={stage > 3} 
        />
      </div>
      
      <div className="mt-12 p-4 bg-blue-50 rounded-lg text-xs text-blue-600 max-w-lg text-center">
        <p className="font-semibold mb-1">아키텍처 참고:</p>
        <p>실제 서비스 환경에서는 이 단계에서 MCP(Model Context Protocol)를 사용하여 Google Flights, Booking.com, OpenWeatherMap API 등을 호출해 실시간 데이터를 가져옵니다.</p>
      </div>
    </div>
  );
};

const AgentStep = ({ icon, text, active, completed }: { icon: React.ReactNode, text: string, active: boolean, completed: boolean }) => (
  <div className={`flex items-center p-3 rounded-lg transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
    <div className={`mr-4 p-2 rounded-full ${completed ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
      {completed ? <CheckCircle2 size={20} /> : icon}
    </div>
    <span className={`font-medium ${completed ? 'text-teal-900' : 'text-slate-600'}`}>{text}</span>
    {active && !completed && <span className="ml-auto text-xs font-bold text-teal-500 animate-bounce">진행중</span>}
  </div>
);