# 서울 중구 데이트맵 MVP 0.2

모바일 우선의 서울 데이트 컬렉션 게임 프로토타입입니다.

## 핵심 흐름

NAVER 지도 탐색
→ 장소 마커 선택
→ 데이트 특화 장소 카드
→ NAVER 지역검색 정보 확인
→ GPS 방문 인증
→ 사용자 최종 확인
→ 동네 탐험 포인트 상승

## 개발 구조

- Next.js 15.5.24
- NAVER Maps JavaScript API v3
- NAVER 지역검색 API (서버 Route에서 호출)
- Browser Geolocation
- localStorage (MVP용 방문 기록)
- Vercel 배포

설정 방법은 UPDATE_GUIDE_KR.md를 확인하세요.
