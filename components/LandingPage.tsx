import React from 'react';
import toast from 'react-hot-toast';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center px-4 py-10 sm:px-10 lg:px-40 lg:py-20 animate-fade-in-up">
        <div className="mx-auto max-w-[960px] w-full">
          <div className="overflow-hidden rounded-2xl bg-slate-900 relative min-h-[500px] flex items-center justify-center text-center px-4 sm:px-10 shadow-2xl">
            <div 
              className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqUExlIr2qmdbNAMVLKKAm9ocjrfX5c0uq47aY_0r4qLC49DYZrHhl86Z59OZOQILu_kv2kIllkU-8eguRhc4Xdt3wBWP06aAOlZ_MK54GuseimHSv07xcv254iSuO8lPTb8lpKYbwQJ1gjbXU9cCkrMtEOOqJqn6S0XfNKJawNLuv1eXoeFW5AqLjkTx4F35nT7YND7vOtlEt2sZrT0yyYR2toMFVbrNF7cFqMMI5x7B621hvkhflsl3bFIkmktpKBFiQHN-g59o")' }}
            >
            </div>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
            <div className="relative z-20 flex flex-col items-center gap-6 max-w-3xl">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
                AI가 설계하는<br/>
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary">완벽한 여행</span>
              </h1>
              <p className="text-base font-medium text-slate-200 sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
                복잡한 계획은 저희에게 맡기세요. 당신의 취향만 알려주시면<br className="hidden sm:block"/>최적의 여행지와 일정을 1분 안에 추천해 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <button 
                  onClick={onStart}
                  className="h-12 sm:h-14 px-8 rounded-full bg-primary text-white text-base sm:text-lg font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>여행 일정 받기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-10 sm:px-10 lg:px-40 bg-white">
        <div className="mx-auto max-w-[960px] flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              왜 <span className="text-primary">TripAI</span>인가요?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl">
              여행 준비의 시작부터 끝까지,여행 전문가 AI가 당신에게 완벽한 여행 일정을 제안해드립니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon="psychology"
              title="스마트 매칭"
              description="사용자의 여행 스타일, 예산, 동반자를 심층 분석하여 실패 없는 맞춤형 여행지를 제안합니다."
            />
            <FeatureCard 
              icon="schedule"
              title="시간 절약"
              description="수십 시간이 걸리던 항공권, 숙소, 동선 계획을 단 1분 만에 완성된 일정표로 받아보세요."
            />
            <FeatureCard 
              icon="location_on"
              title="숨은 명소 발견"
              description="관광객들로 붐비는 곳 대신, 현지인만 아는 숨겨진 명소와 찐 맛집 정보를 제공합니다."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-10 lg:px-40">
        <div className="mx-auto max-w-[960px]">
          <div className="rounded-2xl bg-slate-900 px-6 py-12 text-center shadow-xl sm:px-12 sm:py-20 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                지금 바로 떠날 준비 되셨나요?
              </h2>
              <p className="max-w-xl text-lg text-slate-300">
                나만의 맞춤형 여행 일정을 지금 바로 확인해보세요.<br className="hidden sm:block"/>
                회원가입 없이 무료로 시작할 수 있습니다.
              </p>
              <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button 
                  onClick={onStart}
                  className="h-12 w-full min-w-[200px] max-w-xs rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40 sm:w-auto"
                >
                  여행 추천 시작하기
                </button>
                <button 
                  onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })}
                  className="h-12 w-full min-w-[200px] max-w-xs rounded-lg border border-slate-600 bg-transparent px-8 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  더 알아보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-background-light p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{icon}</span>
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  </div>
);