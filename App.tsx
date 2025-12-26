import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TravelForm } from './components/TravelForm';
import { LoadingScreen } from './components/LoadingScreen';
import { RecommendationList } from './components/RecommendationList';
import { ItineraryDetail } from './components/ItineraryDetail';
import { generateTravelPlan } from './services/geminiService';
import { TravelPreferences, TripRecommendation, AppStep } from './types';
import { Map, Plane } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('LANDING');
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripRecommendation | null>(null);

  const handleStart = () => {
    setStep('INPUT');
  };

  const handleFormSubmit = async (prefs: TravelPreferences) => {
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header - Show minimal header on Landing, Full header on app */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${step === 'LANDING' ? 'bg-transparent backdrop-blur-sm pt-4' : 'bg-white/80 backdrop-blur-md border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={handleGoToLanding} className="flex items-center space-x-2 group">
            <div className={`p-2 rounded-xl transition-colors ${step === 'LANDING' ? 'bg-white/20 text-white group-hover:bg-white/30' : 'bg-teal-600 text-white group-hover:bg-teal-700'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-extrabold tracking-tight ${step === 'LANDING' ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>
              트립지니어스 AI
            </h1>
          </button>
          
          {step !== 'LANDING' && step !== 'INPUT' && (
             <button onClick={handleStartOver} className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition bg-white/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200">
               새 여행 만들기
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`${step === 'LANDING' ? 'pt-0' : 'pt-8 pb-12'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all`}>
        {step === 'LANDING' && (
          <LandingPage onStart={handleStart} />
        )}

        {step === 'INPUT' && (
          <div className="animate-fade-in-up">
            <TravelForm onSubmit={handleFormSubmit} onBack={handleGoToLanding} />
          </div>
        )}

        {step === 'LOADING' && (
          <div className="animate-fade-in">
            <LoadingScreen />
          </div>
        )}

        {step === 'RESULTS' && (
          <div className="animate-fade-in">
            <RecommendationList 
              recommendations={recommendations} 
              onSelect={handleTripSelect} 
              onBack={handleStartOver}
            />
          </div>
        )}

        {step === 'DETAIL' && selectedTrip && (
          <div className="animate-fade-in">
            <ItineraryDetail 
              trip={selectedTrip} 
              onBack={handleBackToResults} 
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      {step !== 'LANDING' && (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm font-medium">&copy; {new Date().getFullYear()} 트립지니어스 AI. Powered by Google Gemini.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;