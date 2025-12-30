# Unsplash 크레딧 추가 가이드

## 법적 준수를 위한 간단한 크레딧 표시

Unsplash API를 상업적으로 사용하려면 사진 크레딧을 표시해야 합니다.
가장 간단한 방법은 Footer에 작은 텍스트를 추가하는 것입니다.

## 방법 1: Footer에 추가 (가장 간단)

`App.tsx` 파일의 164-166번 라인을 다음과 같이 수정:

```tsx
<div className="text-sm text-slate-400 text-center md:text-right">
   © 2024 TripAI. All rights reserved.
   <br />
   <a 
     href="https://unsplash.com" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-xs text-slate-300 hover:text-slate-400 transition-colors"
   >
     Photos from Unsplash
   </a>
</div>
```

## 방법 2: 각 이미지에 작은 배지 추가 (더 정확)

### RecommendationList.tsx (104-115번 라인)

```tsx
<div className="relative h-60 overflow-hidden">
    <img 
        src={trip.imageUrl || `https://picsum.photos/seed/${trip.destination}/800/600`}
        alt={trip.destination}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full text-slate-900 shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-blue-500">beach_access</span> 추천
        </span>
    </div>
    {/* Unsplash Credit */}
    <div className="absolute bottom-2 right-2">
        <a 
            href="https://unsplash.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-white/70 hover:text-white bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm transition-colors"
            onClick={(e) => e.stopPropagation()}
        >
            Unsplash
        </a>
    </div>
</div>
```

### ItineraryDetail.tsx (151번 라인 근처)

```tsx
<div className="relative h-80 overflow-hidden rounded-xl">
    <img 
        src={trip.attractions[currentAttractionIndex].imageUrl || `...`}
        alt={trip.attractions[currentAttractionIndex].name}
        className="w-full h-full object-cover"
    />
    {/* Unsplash Credit */}
    <div className="absolute bottom-2 right-2">
        <a 
            href="https://unsplash.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-white/70 hover:text-white bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm"
        >
            Unsplash
        </a>
    </div>
</div>
```

## 추천 방법

**방법 1 (Footer)을 추천합니다:**
- ✅ 가장 간단
- ✅ 모든 이미지 커버
- ✅ UI 방해 최소화
- ✅ Unsplash 정책 준수

## 적용 후 확인

1. Footer 하단에 "Photos from Unsplash" 링크 표시
2. 클릭 시 Unsplash 홈페이지로 이동
3. 작고 눈에 띄지 않게 표시됨

## Unsplash 정책 참고

- https://unsplash.com/api-terms
- 상업적 사용 허용
- 크레딧 표시 필수
- "Photo by [작가명] on Unsplash" 또는 "Photos from Unsplash" 형식

---

**현재 상태:** Footer에 크레딧만 추가하면 완전히 합법적으로 수익화 가능합니다!
