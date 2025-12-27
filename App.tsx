import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TravelForm } from './components/TravelForm';
import { LoadingScreen } from './components/LoadingScreen';
import { RecommendationList } from './components/RecommendationList';
import { ItineraryDetail } from './components/ItineraryDetail';
import { recommendDestinations, recommendItinerary } from './services/api';
import { TravelPreferences, TripRecommendation, AppStep } from './types';
import toast, { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('LANDING');
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripRecommendation | null>(null);
  const [userPrefs, setUserPrefs] = useState<TravelPreferences | null>(null);

  const handleStart = () => {
    setStep('INPUT');
  };

  const handleFormSubmit = async (prefs: TravelPreferences) => {
    setUserPrefs(prefs);
    setStep('LOADING');
    try {
      const results = await recommendDestinations(prefs);
      setRecommendations(results);
      setStep('RESULTS');
    } catch (error) {
      console.error(error);
      toast.error("여행지를 추천받지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setStep('INPUT');
    }
  };

  const handleTripSelect = async (trip: TripRecommendation) => {
    if (!userPrefs) return;
    
    setStep('LOADING');
    try {
      // 이미 일정이 있다면 다시 요청하지 않음 (캐싱 효과)
      if (trip.itinerary && trip.itinerary.length > 0) {
        setSelectedTrip(trip);
        setStep('DETAIL');
        return;
      }

      const { itinerary, attractions } = await recommendItinerary(trip.destination, userPrefs);
      const updatedTrip = { ...trip, itinerary, attractions };
      
      // 추천 목록 업데이트 (캐싱을 위해)
      setRecommendations(prev => prev.map(r => r.id === trip.id ? updatedTrip : r));
      
      setSelectedTrip(updatedTrip);
      setStep('DETAIL');
    } catch (error) {
      console.error(error);
      toast.error("상세 일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setStep('RESULTS');
    }
  };

  const handleBackToResults = () => {
    setSelectedTrip(null);
    setStep('RESULTS');
  };

  const handleStartOver = () => {
    setRecommendations([]);
    setSelectedTrip(null);
    setStep('INPUT');
  };

  const handleGoToLanding = () => {
    setRecommendations([]);
    setSelectedTrip(null);
    setStep('LANDING');
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light text-slate-900">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-10 lg:px-40 max-w-[1440px] mx-auto">
          <button onClick={handleGoToLanding} className="flex items-center gap-4 text-slate-900 hover:opacity-80 transition-opacity">
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>flight_takeoff</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">TripAI</h2>
          </button>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm font-medium hover:text-primary transition-colors">소개</button>
              <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm font-medium hover:text-primary transition-colors">기능</button>
              <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm font-medium hover:text-primary transition-colors">로그인</button>
            </nav>
            {step === 'LANDING' ? (
              <button onClick={handleStart} className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
                <span className="truncate">회원가입</span>
              </button>
            ) : (
              <button onClick={handleStartOver} className="flex h-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 px-5 text-sm font-bold hover:bg-slate-200 transition-colors">
                <span className="truncate">새 여행</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 md:px-8">
        {step === 'LANDING' && (
          <LandingPage onStart={handleStart} />
        )}

        {step === 'INPUT' && (
          <div className="animate-fade-in-up w-full flex justify-center">
            <TravelForm onSubmit={handleFormSubmit} onBack={handleGoToLanding} />
          </div>
        )}

        {step === 'LOADING' && (
          <div className="animate-fade-in w-full flex justify-center">
            <LoadingScreen />
          </div>
        )}

        {step === 'RESULTS' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 md:px-8 py-8">
            <RecommendationList 
              recommendations={recommendations} 
              onSelect={handleTripSelect} 
              onBack={handleStartOver}
              prefs={userPrefs}
            />
          </div>
        )}

        {step === 'DETAIL' && selectedTrip && userPrefs && (
          <div className="animate-fade-in w-full max-w-[1200px] px-4 sm:px-10">
            <ItineraryDetail 
              trip={selectedTrip} 
              prefs={userPrefs}
              onBack={handleBackToResults} 
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-10 lg:px-40">
        <div className="mx-auto max-w-[960px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined">flight_takeoff</span>
            </div>
            <span className="text-sm font-bold text-slate-900">TripAI</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm text-slate-500 hover:text-primary">서비스 이용약관</button>
            <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm text-slate-500 hover:text-primary">개인정보 처리방침</button>
            <button onClick={() => toast('서비스 개발 중입니다.', { icon: '🚧' })} className="text-sm text-slate-500 hover:text-primary">고객센터</button>
          </div>
          <div className="text-sm text-slate-400">
             © 2024 TripAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;