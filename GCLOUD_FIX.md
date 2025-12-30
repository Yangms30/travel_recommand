# Google Cloud SDK 설치 문제 해결 가이드

## 문제
Google Cloud SDK가 Python 3.13을 찾으려고 하지만, 시스템에는 Python 3.11만 설치되어 있습니다.

## 해결 방법

### 방법 1: 환경 변수 설정 (추천)

터미널에서 다음 명령어를 실행:

```bash
# ~/.zshrc 파일에 추가
echo 'export CLOUDSDK_PYTHON=/Users/yangminseok/.pyenv/shims/python3' >> ~/.zshrc
source ~/.zshrc
```

그 다음 gcloud 재설치:

```bash
brew uninstall google-cloud-sdk
brew install google-cloud-sdk
```

### 방법 2: Python 3.13 설치 (더 간단)

```bash
brew install python@3.13
brew reinstall google-cloud-sdk
```

### 방법 3: gcloud CLI 직접 다운로드 (가장 확실)

```bash
# Homebrew 대신 공식 설치 스크립트 사용
curl https://sdk.cloud.google.com | bash

# 터미널 재시작 후
exec -l $SHELL

# 초기화
gcloud init
```

---

## 추천 방법

**방법 3 (공식 설치 스크립트)**를 추천합니다:

1. 더 안정적
2. Python 버전 자동 감지
3. 설정 자동화

---

## 설치 후 확인

```bash
# gcloud 버전 확인
gcloud --version

# 로그인
gcloud auth login

# 프로젝트 생성
gcloud projects create travel-recommand-prod
```

---

## 대안: Vercel만 사용

백엔드 배포가 복잡하다면, 일단 **프론트엔드만 Vercel에 배포**하고,
백엔드는 나중에 배포하는 것도 좋은 방법입니다.

### Vercel만 사용하는 경우:

1. ✅ 프론트엔드 배포 (무료)
2. ✅ AdSense 광고 수익
3. ✅ 제휴 마케팅 링크
4. ⏳ 백엔드는 로컬에서 실행 (개발용)

나중에 트래픽이 증가하면 백엔드를 배포하면 됩니다.

---

## 빠른 해결책

지금 바로 시작하려면:

```bash
# 방법 3 실행
curl https://sdk.cloud.google.com | bash
```

이 명령어 하나면 모든 문제가 해결됩니다!
