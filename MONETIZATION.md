# 💰 TripAI 수익화 가이드

## 📊 수익 모델 개요

TripAI는 다양한 수익화 방법을 통해 지속 가능한 비즈니스 모델을 구축할 수 있습니다.

---

## 1. 광고 수익 (Google AdSense)

### 설정 방법

#### Step 1: Google AdSense 가입
1. https://www.google.com/adsense 접속
2. Google 계정으로 가입
3. 웹사이트 URL 등록
4. 승인 대기 (1-2주)

#### Step 2: 광고 코드 삽입

**index.html에 스크립트 추가:**
```html
<head>
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
</head>
```

**컴포넌트에서 사용:**
```tsx
import { AdBanner } from './components/AdBanner';

// 로딩 화면 하단
<AdBanner slot="1234567890" format="horizontal" />

// 추천 결과 사이
<AdBanner slot="0987654321" format="rectangle" />
```

### 광고 배치 전략

**최적 위치:**
1. **로딩 화면 하단** (체류 시간 20-50초)
   - 가장 높은 노출 시간
   - 사용자가 대기 중이므로 광고 클릭률 높음

2. **추천 결과 카드 사이** (네이티브 광고)
   - 자연스러운 배치
   - 높은 클릭률

3. **일정 상세 하단**
   - 콘텐츠 소비 후 광고 노출
   - 관련 광고 매칭 가능

### 예상 수익

| 일 방문자 | 월 페이지뷰 | 예상 수익 (월) |
|----------|------------|---------------|
| 100명 | 3,000 | $10-30 |
| 1,000명 | 30,000 | $100-300 |
| 10,000명 | 300,000 | $1,000-3,000 |

---

## 2. 제휴 마케팅

### A. 호텔 예약 제휴

#### Booking.com Affiliate

**가입:**
1. https://www.booking.com/affiliate 접속
2. 파트너 계정 생성
3. Affiliate ID 발급

**구현:**
```tsx
// components/HotelLink.tsx
export const HotelLink = ({ destination, checkIn, checkOut }) => {
  const affiliateId = 'YOUR_AFFILIATE_ID';
  const url = `https://www.booking.com/searchresults.html?
    ss=${encodeURIComponent(destination)}&
    checkin=${checkIn}&
    checkout=${checkOut}&
    aid=${affiliateId}`;
  
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="hotel-link">
      🏨 {destination} 호텔 찾기
    </a>
  );
};
```

**커미션:** 예약 금액의 3-5%

#### Agoda Partner

**가입:** https://partners.agoda.com
**커미션:** 예약 금액의 4-7%

### B. 항공권 예약 제휴

#### Skyscanner Affiliate

**가입:** https://www.skyscanner.net/affiliates
**커미션:** 클릭당 $0.50-2.00

**구현:**
```tsx
export const FlightLink = ({ origin, destination, date }) => {
  const url = `https://www.skyscanner.com/transport/flights/
    ${origin}/${destination}/${date}?
    associateid=YOUR_ID`;
  
  return <a href={url}>✈️ 항공권 검색</a>;
};
```

### C. 투어/액티비티 제휴

#### Klook Affiliate

**가입:** https://affiliate.klook.com
**커미션:** 예약 금액의 5-10%

**구현:**
```tsx
export const ActivityLink = ({ destination, activity }) => {
  const url = `https://www.klook.com/search/?
    query=${encodeURIComponent(activity)}&
    city=${destination}&
    affiliate_id=YOUR_ID`;
  
  return <a href={url}>🎫 {activity} 예약하기</a>;
};
```

### 제휴 마케팅 예상 수익

| 월 방문자 | 전환율 | 평균 예약액 | 커미션 | 월 수익 |
|----------|--------|------------|--------|---------|
| 1,000 | 1% | $200 | 5% | $100 |
| 5,000 | 2% | $250 | 5% | $1,250 |
| 10,000 | 3% | $300 | 5% | $4,500 |

---

## 3. 프리미엄 구독 모델

### 기능 구분

#### 무료 플랜
- 월 3회 일정 생성
- 기본 여행지 추천 (3개)
- 광고 표시
- 기본 맛집 정보

#### 프리미엄 플랜 ($4.99/월)
- 무제한 일정 생성
- 확장 여행지 추천 (10개)
- 광고 제거
- 상세 맛집 정보 + 예약 링크
- PDF 다운로드
- 우선 처리 (빠른 생성)
- 여행 체크리스트
- 예산 추적 도구

### 구현 방법

#### Stripe 결제 연동

**설치:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**구현:**
```tsx
// components/SubscriptionButton.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_XXXXXXXX');

export const SubscriptionButton = () => {
  const handleSubscribe = async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });
    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <button onClick={handleSubscribe}>
      프리미엄 구독 ($4.99/월)
    </button>
  );
};
```

**백엔드 (FastAPI):**
```python
import stripe

stripe.api_key = "sk_live_XXXXXXXX"

@app.post("/api/create-checkout-session")
async def create_checkout_session():
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': 'price_XXXXXXXX',  # Stripe Price ID
            'quantity': 1,
        }],
        mode='subscription',
        success_url='https://your-domain.com/success',
        cancel_url='https://your-domain.com/cancel',
    )
    return {"sessionId": session.id}
```

### 가격 전략

**월간 구독:**
- $4.99/월 (₩6,900)

**연간 구독 (할인):**
- $39.99/년 (₩55,000) - 33% 할인

### 예상 수익

| 월 방문자 | 전환율 | 구독자 | 월 수익 |
|----------|--------|--------|---------|
| 1,000 | 2% | 20 | $100 |
| 5,000 | 2% | 100 | $500 |
| 10,000 | 2% | 200 | $1,000 |

---

## 4. API 판매 (B2B)

### 타겟 고객

- 여행사
- 호텔 체인
- 항공사
- 여행 블로거/인플루언서
- 여행 앱 개발사

### 가격 모델

```
Starter Plan: $49/월
- 1,000 API 요청
- 기본 지원
- 이메일 지원

Pro Plan: $199/월
- 10,000 API 요청
- 우선 지원
- 전화/이메일 지원
- 커스텀 브랜딩

Enterprise Plan: $999/월
- 무제한 요청
- 전담 지원
- SLA 보장
- 커스텀 기능 개발
```

### 구현

**API 키 발급 시스템:**
```python
# backend/app/api/api_keys.py
from fastapi import Header, HTTPException

async def verify_api_key(x_api_key: str = Header(...)):
    # DB에서 API 키 검증
    if not is_valid_api_key(x_api_key):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    # 사용량 체크
    if exceeded_quota(x_api_key):
        raise HTTPException(status_code=429, detail="Quota exceeded")
    
    return x_api_key

@app.post("/api/v1/recommend")
async def api_recommend(
    preferences: dict,
    api_key: str = Depends(verify_api_key)
):
    # 일정 생성 로직
    return result
```

### 예상 수익

| 고객 수 | 평균 플랜 | 월 수익 |
|---------|----------|---------|
| 5 | Pro | $1,000 |
| 10 | Pro | $2,000 |
| 20 | Mixed | $5,000 |

---

## 5. 스폰서십 & 파트너십

### 기회

1. **도시 관광청 협업**
   - 특정 도시 프로모션
   - 월 $500-2,000

2. **항공사 파트너십**
   - 항공권 특별 할인 제공
   - 월 $1,000-5,000

3. **호텔 체인 협업**
   - 호텔 추천 우선 노출
   - 월 $500-3,000

---

## 📊 종합 수익 예상

### 시나리오 1: 소규모 (월 1,000 방문자)

| 수익원 | 월 수익 |
|--------|---------|
| Google AdSense | $100 |
| 제휴 마케팅 | $100 |
| 프리미엄 구독 | $100 |
| **총합** | **$300** |

### 시나리오 2: 중규모 (월 10,000 방문자)

| 수익원 | 월 수익 |
|--------|---------|
| Google AdSense | $1,000 |
| 제휴 마케팅 | $4,500 |
| 프리미엄 구독 | $1,000 |
| API 판매 | $1,000 |
| **총합** | **$7,500** |

### 시나리오 3: 대규모 (월 100,000 방문자)

| 수익원 | 월 수익 |
|--------|---------|
| Google AdSense | $10,000 |
| 제휴 마케팅 | $45,000 |
| 프리미엄 구독 | $10,000 |
| API 판매 | $10,000 |
| 스폰서십 | $5,000 |
| **총합** | **$80,000** |

---

## 🎯 실행 로드맵

### Phase 1: 즉시 실행 (0-1개월)

**목표:** 첫 수익 발생

1. ✅ Google AdSense 가입 및 승인
2. ✅ Booking.com, Klook 제휴 가입
3. ✅ 광고 및 제휴 링크 삽입
4. ✅ 배포 및 트래픽 확보

**예상 수익:** $50-200/월

### Phase 2: 성장 (1-3개월)

**목표:** 수익 다각화

1. ✅ 프리미엄 구독 모델 개발
2. ✅ Stripe 결제 연동
3. ✅ 사용자 피드백 수집
4. ✅ SEO 최적화

**예상 수익:** $500-1,500/월

### Phase 3: 확장 (3-6개월)

**목표:** B2B 진출

1. ✅ API 판매 시작
2. ✅ 파트너십 체결
3. ✅ 다국어 지원
4. ✅ 모바일 앱 출시 (선택)

**예상 수익:** $2,000-10,000/월

---

## 💡 성공 팁

### 1. 사용자 경험 우선
- 광고는 적절히 배치 (너무 많으면 이탈)
- 프리미엄 기능은 확실한 가치 제공

### 2. 데이터 분석
- Google Analytics 설치
- 전환율 추적
- A/B 테스트

### 3. 마케팅
- SEO 최적화
- SNS 마케팅 (Instagram, TikTok)
- 여행 커뮤니티 참여

### 4. 법적 준비
- 개인정보처리방침
- 이용약관
- 사업자 등록 (수익 발생 시)

---

## 📞 다음 단계

1. **AdSense 가입** - 가장 쉬운 시작
2. **제휴 프로그램 가입** - Booking.com, Klook
3. **광고 컴포넌트 추가** - AdBanner.tsx 활용
4. **배포 및 테스트**

수익화 준비 완료! 🚀
