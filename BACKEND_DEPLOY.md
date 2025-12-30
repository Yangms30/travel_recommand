# 🚀 백엔드 배포 가이드 (Google Cloud Run)

## ✅ gcloud 설치 완료!

Google Cloud SDK가 성공적으로 설치되었습니다.

---

## 📝 배포 단계

### 1. Google Cloud 로그인

```bash
gcloud auth login
```

브라우저가 열리면 Google 계정으로 로그인하세요.

---

### 2. 프로젝트 생성

```bash
# 프로젝트 ID는 전역적으로 고유해야 합니다
gcloud projects create travel-recommand-prod-YOUR_UNIQUE_ID --name="TripAI Backend"

# 생성한 프로젝트 설정
gcloud config set project travel-recommand-prod-YOUR_UNIQUE_ID
```

**YOUR_UNIQUE_ID를 본인의 고유 ID로 변경하세요** (예: yangms30)

---

### 3. 결제 계정 연결 (필수)

Google Cloud Console에서 수동으로 진행:
1. https://console.cloud.google.com/billing 접속
2. 결제 계정 생성 (신용카드 등록)
3. 프로젝트에 결제 계정 연결

**무료 크레딧:** 신규 가입 시 $300 무료 크레딧 제공

---

### 4. API 활성화

```bash
# Cloud Run API 활성화
gcloud services enable run.googleapis.com

# Cloud Build API 활성화
gcloud services enable cloudbuild.googleapis.com

# Container Registry API 활성화
gcloud services enable containerregistry.googleapis.com
```

---

### 5. 백엔드 배포

```bash
cd backend

# Docker 이미지 빌드 및 Cloud Run 배포 (한 번에!)
gcloud run deploy travel-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=sk-YOUR_KEY,TAVILY_API_KEY=tvly-YOUR_KEY,UNSPLASH_ACCESS_KEY=YOUR_KEY,OPENWEATHER_API_KEY=YOUR_KEY,GPLACES_API_KEY=YOUR_KEY
```

**환경 변수를 실제 값으로 변경하세요!**

---

### 6. 배포 URL 확인

배포가 완료되면 다음과 같은 URL이 출력됩니다:
```
Service URL: https://travel-backend-xxxxx-an.a.run.app
```

이 URL을 복사하세요!

---

### 7. 프론트엔드 환경 변수 업데이트

Vercel 대시보드에서:
1. Settings → Environment Variables
2. `VITE_API_URL` 추가
3. 값: `https://travel-backend-xxxxx-an.a.run.app`
4. Redeploy

---

### 8. CORS 설정 업데이트

`backend/main.py` 파일에서 Vercel 도메인 추가:

```python
origins = [
    "https://travel-recommand.vercel.app",  # 실제 Vercel 도메인
    "http://localhost:5173",
]
```

재배포:
```bash
gcloud run deploy travel-backend --source .
```

---

## 💰 비용 예상

### Cloud Run 무료 티어
- 월 200만 요청
- 월 36만 GB-초 (메모리 × 시간)
- 월 180,000 vCPU-초

### 예상 비용 (무료 티어 초과 시)
- 요청당: $0.40/백만
- 메모리: $0.0000025/GB-초
- CPU: $0.00001/vCPU-초

**예상:** 월 1,000명 방문 → **무료**  
**예상:** 월 10,000명 방문 → **$5-15**

---

## 🔧 유용한 명령어

### 로그 확인
```bash
gcloud run logs read travel-backend --limit=50
```

### 서비스 상태 확인
```bash
gcloud run services describe travel-backend --region=asia-northeast3
```

### 환경 변수 업데이트
```bash
gcloud run services update travel-backend \
  --update-env-vars NEW_VAR=value
```

### 서비스 삭제
```bash
gcloud run services delete travel-backend --region=asia-northeast3
```

---

## 🐛 문제 해결

### 배포 실패
```bash
# 로그 확인
gcloud run logs read travel-backend

# 빌드 로그 확인
gcloud builds list
gcloud builds log [BUILD_ID]
```

### 환경 변수 누락
```bash
# 현재 환경 변수 확인
gcloud run services describe travel-backend --format="value(spec.template.spec.containers[0].env)"
```

---

## ✅ 배포 완료 체크리스트

- [ ] gcloud 로그인 완료
- [ ] 프로젝트 생성 및 설정
- [ ] 결제 계정 연결
- [ ] API 활성화
- [ ] 환경 변수 준비
- [ ] 백엔드 배포 완료
- [ ] 배포 URL 확인
- [ ] Vercel 환경 변수 업데이트
- [ ] CORS 설정 업데이트
- [ ] 재배포 완료
- [ ] 실제 테스트 완료

---

**준비 완료!** 이제 배포를 시작하세요! 🚀
