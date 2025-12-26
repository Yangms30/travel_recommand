import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TravelForm } from './components/TravelForm';
import { LoadingScreen } from './components/LoadingScreen';
import { RecommendationList } from './components/RecommendationList';
import { ItineraryDetail } from './components/ItineraryDetail';
import { generateTravelPlan } from './services/geminiService';
import { TravelPreferences, TripRecommendation, AppStep } from './types';

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
      const results = await generateTravelPlan(prefs);
      setRecommendations(results);
      setStep('RESULTS');
    } catch (error) {
      console.error(error);
      alert("일정을 생성하지 못했습니다. 다시 시도해 주세요.");
      setStep('INPUT');
    }
  };

  const handleTripSelect = (trip: TripRecommendation) => {
    setSelectedTrip(trip);
    setStep('DETAIL');
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
              <button onClick={handleGoToLanding} className="text-sm font-medium hover:text-primary transition-colors">소개</button>
              <button className="text-sm font-medium hover:text-primary transition-colors">기능</button>
              <button className="text-sm font-medium hover:text-primary transition-colors">로그인</button>
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
            <a className="text-sm text-slate-500 hover:text-primary" href="#">서비스 이용약관</a>
            <a className="text-sm text-slate-500 hover:text-primary" href="#">개인정보 처리방침</a>
            <a className="text-sm text-slate-500 hover:text-primary" href="#">고객센터</a>
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