# ✅ 프로젝트 생성 완료!

프로젝트 ID: `travelre`
프로젝트 이름: TripAI Backend

---

## 🔴 중요: 결제 계정 연결 필요

Cloud Run을 사용하려면 결제 계정을 연결해야 합니다.

### 결제 계정 연결 방법

1. **브라우저에서 다음 URL 접속:**
   ```
   https://console.cloud.google.com/billing?project=travelre
   ```

2. **"결제 계정 연결" 클릭**

3. **신용카드 등록**
   - 신규 가입 시 $300 무료 크레딧 제공
   - 무료 크레딧으로 충분히 테스트 가능

4. **프로젝트에 결제 계정 연결**

---

## 결제 계정 연결 후 실행할 명령어

```bash
# API 활성화
~/google-cloud-sdk/bin/gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 백엔드 배포
cd backend
~/google-cloud-sdk/bin/gcloud run deploy travel-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

---

## 💰 비용 안내

### 무료 티어
- Cloud Run: 월 200만 요청 무료
- 신규 가입: $300 무료 크레딧 (90일)

### 예상 비용
- 월 1,000명 방문: **무료**
- 월 10,000명 방문: **$5-15**

---

**다음 단계:**
1. ✅ 프로젝트 생성 완료
2. ⏳ 결제 계정 연결 (위 URL 접속)
3. ⏳ API 활성화
4. ⏳ 백엔드 배포

결제 계정 연결이 완료되면 알려주세요!
