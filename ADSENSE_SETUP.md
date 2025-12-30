# 🎯 Google AdSense 빠른 설정 가이드

## ✅ 준비 완료 사항

1. ✅ `AdBanner.tsx` 컴포넌트 생성됨
2. ✅ `index.html`에 AdSense 스크립트 준비됨 (주석 처리)
3. ✅ 광고 삽입 위치 준비됨

---

## 📝 AdSense 가입 절차 (5분)

### Step 1: 계정 생성
1. https://www.google.com/adsense 접속
2. Google 계정으로 로그인
3. "시작하기" 클릭

### Step 2: 웹사이트 등록
```
웹사이트 URL: https://your-app.vercel.app (배포 후)
이메일: your-email@gmail.com
```

### Step 3: 계정 정보 입력
- 국가: 대한민국
- 주소
- 전화번호

### Step 4: 승인 대기
- 보통 1-2주 소요
- 승인 메일 확인

---

## 🔧 코드 활성화 (승인 후)

### 1. Publisher ID 확인
AdSense 대시보드에서 `ca-pub-XXXXXXXXXXXXXXXX` 형식의 ID 복사

### 2. index.html 수정
```html
<!-- 주석 해제하고 YOUR_PUBLISHER_ID를 실제 ID로 변경 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### 3. 광고 단위 생성
AdSense 대시보드 → 광고 → 광고 단위 → 디스플레이 광고
- 이름: "로딩 화면 광고"
- 크기: 반응형
- Ad Slot ID 복사: `1234567890`

### 4. LoadingScreen.tsx 수정

**현재 위치:** 142번 라인 (Tip Card 다음)

**추가할 코드:**
```tsx
{/* Google AdSense */}
<div className="mt-6 mx-4">
  <ins
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-1234567890123456"  // 실제 Publisher ID
    data-ad-slot="1234567890"  // 실제 Ad Slot ID
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</div>
```

**또는 AdBanner 컴포넌트 사용:**
```tsx
import { AdBanner } from './AdBanner';

// LoadingScreen 컴포넌트 내부, Tip Card 다음에:
<AdBanner slot="1234567890" format="auto" className="mt-6 mx-4" />
```

### 5. AdBanner 컴포넌트 수정

`components/AdBanner.tsx` 파일에서:
```tsx
data-ad-client="ca-pub-1234567890123456"  // 실제 ID로 변경
```

---

## 📍 추천 광고 위치

### 위치 1: 로딩 화면 하단 (최우선)
- 파일: `components/LoadingScreen.tsx`
- 위치: Tip Card 다음 (142번 라인)
- 이유: 20-50초 대기 시간, 높은 노출

### 위치 2: 추천 결과 사이
- 파일: `App.tsx`
- 위치: 추천 카드 사이
- 이유: 네이티브 광고 효과

### 위치 3: 일정 상세 하단
- 파일: `components/ItineraryDetail.tsx`
- 위치: 일정 목록 하단
- 이유: 콘텐츠 소비 후 광고

---

## 🚀 배포 후 체크리스트

### 배포 전
- [ ] Vercel/Cloud Run 배포 완료
- [ ] 실제 도메인 URL 확보
- [ ] AdSense 가입 및 URL 등록

### 승인 후
- [ ] Publisher ID 확인
- [ ] `index.html` 스크립트 활성화
- [ ] 광고 단위 생성 (3개)
- [ ] Ad Slot ID 확인
- [ ] `AdBanner.tsx` ID 업데이트
- [ ] `LoadingScreen.tsx`에 광고 추가
- [ ] 재배포
- [ ] 광고 표시 확인

---

## 💰 예상 수익 (참고)

| 일 방문자 | 광고 노출 | 클릭률 | 클릭당 수익 | 월 수익 |
|----------|----------|--------|------------|---------|
| 100 | 300 | 1% | $0.50 | $45 |
| 1,000 | 3,000 | 1% | $0.50 | $450 |
| 10,000 | 30,000 | 1% | $0.50 | $4,500 |

---

## 🐛 문제 해결

### 광고가 표시되지 않음
1. Publisher ID 확인
2. Ad Slot ID 확인
3. 브라우저 광고 차단 해제
4. 24시간 대기 (새 광고 활성화 시간)

### 승인이 오래 걸림
- 보통 1-2주
- 웹사이트에 충분한 콘텐츠 필요
- 정책 위반 확인

---

## 📞 다음 단계

1. **지금 바로:** AdSense 가입 시작
2. **배포 후:** URL 등록
3. **승인 후:** 코드 활성화
4. **1주일 후:** 수익 확인!

---

**참고 링크:**
- AdSense 가입: https://www.google.com/adsense
- AdSense 정책: https://support.google.com/adsense/answer/48182
- 광고 최적화: https://support.google.com/adsense/answer/17957

**준비 완료!** 🎉
