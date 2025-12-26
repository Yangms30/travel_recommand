import React from 'react';
import { ArrowRight, Sparkles, Map, CalendarClock, Plane } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-3xl my-4 mx-4 shadow-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
            alt="Travel Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>AI 기반 차세대 여행 플래너</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            복잡한 여행 계획,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
              AI에게 맡기고 떠나세요
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            여행 날짜와 취향만 알려주세요. <br className="hidden md:block" />
            최적의 여행지 추천부터 분 단위 일정, 항공/숙소 예약 정보까지 <br className="hidden md:block" />
            단 몇 초 만에 완벽한 계획을 설계해드립니다.
          </p>

          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-teal-600 rounded-full hover:bg-teal-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 shadow-lg hover:shadow-teal-500/30"
          >
            지금 무료로 여행 계획하기
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">왜 트립지니어스인가요?</h2>
          <p className="text-slate-500">당신의 소중한 시간을 위해 가장 스마트한 방법을 제시합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Map className="w-8 h-8 text-teal-600" />}
            title="맞춤형 여행지 추천"
            description="예산, 동행인, 취향을 분석하여 당신에게 딱 맞는 숨겨진 명소를 찾아드립니다."
            delay="0"
          />
          <FeatureCard 
            icon={<CalendarClock className="w-8 h-8 text-indigo-600" />}
            title="나노 단위 일정 계획"
            description="이동 동선을 고려한 효율적인 일정으로 낭비되는 시간 없이 여행을 즐기세요."
            delay="200"
          />
          <FeatureCard 
            icon={<Plane className="w-8 h-8 text-rose-600" />}
            title="원스톱 예약 연동"
            description="추천된 일정에 맞는 최적의 항공권과 숙소를 즉시 확인하고 예약할 수 있습니다."
            delay="400"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className={`bg-white p-8 rounded-2xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-${delay}`}>
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);