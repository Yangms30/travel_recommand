# 🚂 Railway 백엔드 배포 가이드

## 📋 준비 사항

1. ✅ GitHub 계정
2. ✅ 신용카드 (무료 $5 크레딧, 초과 시 과금)

---

## 🚀 배포 단계 (5분)

### 1단계: Railway 가입

1. **Railway 접속**
   ```
   https://railway.app
   ```

2. **GitHub로 로그인**
   - "Login with GitHub" 클릭
   - GitHub 계정 연동

3. **신용카드 등록**
   - 무료 $5 크레딧 받기
   - 초과 시에만 과금

---

### 2단계: 프로젝트 생성

1. **"New Project" 클릭**

2. **"Deploy from GitHub repo" 선택**

3. **"Yangms30/travel_recommand" 선택**

4. **"Deploy Now" 클릭**

---

### 3단계: 서비스 설정

1. **배포된 서비스 클릭**

2. **"Settings" 탭으로 이동**

3. **"Root Directory" 설정**
   ```
   backend
   ```

4. **"Start Command" 설정**
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

---

### 4단계: 환경 변수 설정

1. **"Variables" 탭 클릭**

2. **다음 환경 변수 추가:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   
   GPLACES_API_KEY=your_google_places_api_key_here
   ```

3. **"Add" 클릭**

---

### 5단계: 재배포

1. **"Deployments" 탭으로 이동**

2. **"Redeploy" 클릭**

3. **배포 로그 확인**
   - 빌드 진행 상황 실시간 확인
   - 에러 발생 시 즉시 확인 가능

---

### 6단계: 배포 URL 확인

배포가 완료되면:

1. **"Settings" → "Domains"**

2. **Public URL 복사**
   ```
   예: https://travel-backend-production.up.railway.app
   ```

---

### 7단계: Vercel 환경 변수 업데이트

1. **Vercel 대시보드 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **travel-recommand 프로젝트 선택**

3. **Settings → Environment Variables**

4. **VITE_API_URL 추가/수정**
   ```
   VITE_API_URL=https://travel-backend-production.up.railway.app
   ```

5. **Redeploy**

---

## ✅ 배포 완료 체크리스트

- [ ] Railway 가입 완료
- [ ] GitHub 연동
- [ ] 프로젝트 생성
- [ ] Root Directory 설정 (backend)
- [ ] Start Command 설정
- [ ] 환경 변수 추가
- [ ] 재배포 완료
- [ ] 배포 URL 확인
- [ ] Vercel 환경 변수 업데이트
- [ ] 프론트엔드 재배포
- [ ] 실제 테스트 완료

---

## 💰 비용

**무료 티어:**
- $5 크레딧/월
- 500시간 실행 시간
- 충분히 테스트 가능

**예상 비용:**
- 개발/테스트: $0-5/월
- 프로덕션 (1,000명/월): $5-10/월

---

## 🐛 문제 해결

### 배포 실패
1. **Logs 탭 확인**
2. **빌드 에러 확인**
3. **requirements.txt 확인**

### 환경 변수 누락
1. **Variables 탭 확인**
2. **모든 변수 설정 확인**

### 포트 에러
1. **Start Command 확인**
2. **`$PORT` 변수 사용 확인**

---

## 📊 Railway vs Cloud Run

| 항목 | Railway | Cloud Run |
|------|---------|-----------|
| 설정 난이도 | ⭐ | ⭐⭐⭐⭐ |
| 배포 시간 | 5분 | 30분+ |
| 로그 확인 | 쉬움 | 복잡 |
| 무료 티어 | $5/월 | $300 크레딧 |
| 자동 배포 | ✅ | ❌ |

---

## 🎉 배포 완료 후

1. **테스트**
   ```
   curl https://your-backend-url.railway.app
   ```

2. **프론트엔드 연결 확인**
   - Vercel 앱에서 여행 일정 생성 테스트

3. **모니터링**
   - Railway 대시보드에서 로그 확인
   - 에러 발생 시 즉시 확인

---

**준비 완료!** 지금 바로 시작하세요! 🚀

https://railway.app
