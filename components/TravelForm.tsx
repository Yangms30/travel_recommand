import React, { useState } from 'react';
import { TravelPreferences, CompanionType } from '../types';
import { Calendar, Users, DollarSign, Heart, MapPin, Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  onSubmit: (prefs: TravelPreferences) => void;
  onBack?: () => void;
}

export const TravelForm: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [prefs, setPrefs] = useState<TravelPreferences>({
    startDate: '',
    endDate: '',
    travelers: 1,
    budgetPerPerson: 1000000,
    currency: 'KRW',
    companion: CompanionType.Solo,
    preferredDestination: '',
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-slate-500 hover:text-slate-800 font-medium transition group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          메인으로 돌아가기
        </button>
      )}
      
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">여행 정보 입력</h2>
          <p className="text-teal-100 opacity-90">몇 가지 질문에 답해주시면 완벽한 플랜을 만들어 드릴게요.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: 일정 및 인원 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-teal-600" /> 출발일
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.startDate}
                  onChange={(e) => setPrefs({ ...prefs, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-teal-600" /> 도착일
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.endDate}
                  onChange={(e) => setPrefs({ ...prefs, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Users className="w-4 h-4 mr-2 text-teal-600" /> 여행 인원
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.travelers}
                  onChange={(e) => setPrefs({ ...prefs, travelers: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Heart className="w-4 h-4 mr-2 text-teal-600" /> 동행자 유형
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.companion}
                  onChange={(e) => setPrefs({ ...prefs, companion: e.target.value as CompanionType })}
                >
                  {Object.values(CompanionType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: 예산 및 선호도 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">세부 선호도</h3>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <DollarSign className="w-4 h-4 mr-2 text-teal-600" /> 1인당 예산
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.budgetPerPerson}
                  onChange={(e) => setPrefs({ ...prefs, budgetPerPerson: parseInt(e.target.value) })}
                />
                <select
                  className="w-28 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  value={prefs.currency}
                  onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                >
                  <option value="KRW">KRW</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <MapPin className="w-4 h-4 mr-2 text-teal-600" /> 희망 여행지 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 일본 오사카, 유럽 배낭여행, 조용한 휴양지..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                value={prefs.preferredDestination}
                onChange={(e) => setPrefs({ ...prefs, preferredDestination: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 mr-2 text-teal-600" /> 특별 요청사항
              </label>
              <textarea
                placeholder="예: 현지 맛집 위주로 추천해주세요, 많이 걷지 않는 일정으로 부탁해요..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                value={prefs.specialRequests}
                onChange={(e) => setPrefs({ ...prefs, specialRequests: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 active:translate-y-0 active:scale-95"
            >
              ✨ AI 여행 일정 생성하기
            </button>
            <p className="text-center text-slate-400 text-xs mt-3">
              AI가 분석하는 데 약 10~20초 정도 소요될 수 있습니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};