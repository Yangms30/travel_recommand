# 🚀 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 완료된 항목
- [x] 프론트엔드 빌드 테스트 통과
- [x] Dockerfile 생성
- [x] .dockerignore 생성

### ⚠️ 배포 전 필수 확인 사항

#### 1. 환경 변수 준비
다음 API 키들이 필요합니다:
- `OPENAI_API_KEY` - OpenAI GPT-4o 사용
- `TAVILY_API_KEY` - Tavily 검색 API
- `UNSPLASH_ACCESS_KEY` - Unsplash 이미지 API (선택)
- `OPENWEATHER_API_KEY` - OpenWeather 날씨 API (선택)
- `GPLACES_API_KEY` - Google Places API (선택)

---

## 🎯 배포 방법

### A. 프론트엔드 배포 (Vercel)

#### 1단계: Vercel 가입 및 연동
```bash
# 1. https://vercel.com 접속
# 2. GitHub 계정으로 로그인
# 3. "New Project" 클릭
```

#### 2단계: 프로젝트 설정
```
Repository: Yangms30/travel_recommand
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3단계: 환경 변수 설정
Vercel 대시보드에서 Environment Variables 추가:
```
VITE_API_URL=https://your-backend-url.run.app
```

#### 4단계: 배포
- "Deploy" 버튼 클릭
- 자동 배포 완료! 🎉

---

### B. 백엔드 배포 (Google Cloud Run)

#### 사전 준비
```bash
# 1. Google Cloud CLI 설치
# macOS
brew install --cask google-cloud-sdk

# 2. 로그인
gcloud auth login

# 3. 프로젝트 생성 또는 선택
gcloud projects create travel-recommand-prod
gcloud config set project travel-recommand-prod

# 4. Cloud Run API 활성화
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 배포 명령어
```bash
cd backend

# 1. Docker 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/travel-recommand-prod/backend

# 2. Cloud Run 배포
gcloud run deploy travel-backend \
  --image gcr.io/travel-recommand-prod/backend \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key_here,TAVILY_API_KEY=your_key_here
```

#### 환경 변수 설정 (보안)
```bash
# Secret Manager 사용 (권장)
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-

# Cloud Run에 Secret 연결
gcloud run services update travel-backend \
  --update-secrets OPENAI_API_KEY=openai-api-key:latest
```

---

## 🔧 배포 후 설정

### 1. CORS 설정 확인
`backend/main.py`에서 Vercel 도메인 추가:
```python
origins = [
    "https://your-app.vercel.app",
    "http://localhost:5173",
]
```

### 2. 프론트엔드 API URL 업데이트
Vercel 환경 변수에 백엔드 URL 설정:
```
VITE_API_URL=https://travel-backend-xxxxx.run.app
```

### 3. 재배포
- 프론트엔드: Git push하면 자동 배포
- 백엔드: 위의 gcloud run deploy 명령어 재실행

---

## 📊 비용 예상

### Vercel (프론트엔드)
- **무료 플랜**: 월 100GB 대역폭
- 개인 프로젝트에 충분

### Google Cloud Run (백엔드)
- **무료 티어**: 월 200만 요청, 36만 GB-초
- **예상 비용**: 월 $5-15 (사용량에 따라)

---

## 🐛 트러블슈팅

### 문제 1: CORS 에러
**해결**: `main.py`의 origins에 Vercel 도메인 추가

### 문제 2: 환경 변수 누락
**해결**: Cloud Run 콘솔에서 환경 변수 확인

### 문제 3: 빌드 실패
**해결**: requirements.txt 확인, Python 버전 확인

---

## 📞 도움말

배포 중 문제가 생기면:
1. Cloud Run 로그 확인: `gcloud run logs read travel-backend`
2. Vercel 로그 확인: Vercel 대시보드 > Deployments > Logs

---

## ✅ 배포 완료 체크리스트

- [ ] 백엔드 Cloud Run 배포 완료
- [ ] 백엔드 URL 확인
- [ ] 프론트엔드 Vercel 배포 완료
- [ ] 환경 변수 모두 설정
- [ ] CORS 설정 완료
- [ ] 실제 테스트 완료
- [ ] 도메인 연결 (선택)

배포 성공을 기원합니다! 🚀
