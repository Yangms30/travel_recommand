import React from 'react';

interface AffiliateLinksProps {
  destination: string;
  checkIn?: string;
  checkOut?: string;
}

export const AffiliateLinks: React.FC<AffiliateLinksProps> = ({ 
  destination, 
  checkIn, 
  checkOut 
}) => {
  // Affiliate IDs (승인 후 업데이트)
  const KLOOK_AFFILIATE_ID = 'YOUR_KLOOK_ID'; // Klook 승인 후 업데이트
  const BOOKING_AFFILIATE_ID = 'YOUR_BOOKING_ID'; // Booking.com 승인 후 업데이트
  const AGODA_AFFILIATE_ID = 'YOUR_AGODA_ID'; // Agoda 승인 후 업데이트

  // URL 생성
  const klookUrl = `https://www.klook.com/search/?query=${encodeURIComponent(destination)}&affiliate_id=${KLOOK_AFFILIATE_ID}`;
  
  const bookingUrl = checkIn && checkOut
    ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkIn}&checkout=${checkOut}&aid=${BOOKING_AFFILIATE_ID}`
    : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&aid=${BOOKING_AFFILIATE_ID}`;
  
  const agodaUrl = `https://www.agoda.com/search?city=${encodeURIComponent(destination)}&cid=${AGODA_AFFILIATE_ID}`;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-blue-600">local_offer</span>
        <h3 className="text-lg font-bold text-slate-900">여행 예약하기</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">
        {destination} 여행을 위한 최적의 호텔과 액티비티를 찾아보세요
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Klook - 투어/액티비티 */}
        <a
          href={klookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600">confirmation_number</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Klook</p>
              <p className="text-xs text-slate-500">투어 & 액티비티</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-600 transition-colors">
            arrow_forward
          </span>
        </a>

        {/* Booking.com - 호텔 */}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">hotel</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Booking.com</p>
              <p className="text-xs text-slate-500">호텔 예약</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">
            arrow_forward
          </span>
        </a>

        {/* Agoda - 호텔 */}
        <a
          href={agodaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-pink-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-pink-600">apartment</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Agoda</p>
              <p className="text-xs text-slate-500">호텔 특가</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-pink-600 transition-colors">
            arrow_forward
          </span>
        </a>
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        💡 링크를 통해 예약하시면 추가 비용 없이 저희를 지원하실 수 있습니다
      </p>
    </div>
  );
};
