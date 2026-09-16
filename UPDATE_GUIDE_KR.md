# 중구 데이트맵 MVP 0.2 업데이트 가이드

이번 버전은 Google Maps를 제거하고 NAVER Maps 기반으로 바꾼 버전입니다.

## 0.2에서 바뀐 기능

- Google Maps 제거
- NAVER Web Dynamic Map 적용
- 도트 스타일 장소 마커
- 장소 클릭 시 Bottom Sheet
- 우리 서비스의 데이트 한줄소개/태그/탐험 포인트
- NAVER 지역검색 API의 장소명/카테고리/설명/주소 표시
- NAVER 장소정보는 별도 영역으로 표시
- NAVER 지도에서 보기 링크
- GPS 100m 반경 + 사용자 최종 확인 방문 인증
- 방문 시 해당 동 탐험 포인트 상승
- 중구 15개 행정동 UI
- 시즌 카드 샘플 유지
- 현재 브라우저 localStorage에 방문 데이터 저장

## 중요: 키가 두 종류입니다

NAVER 지도와 NAVER 지역검색은 서로 다른 API입니다.

### A. NAVER 지도 키
NAVER Cloud Platform에서 발급합니다.

환경변수:
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

### B. NAVER 지역검색 키
NAVER Developers에서 발급합니다.

환경변수:
NAVER_SEARCH_CLIENT_ID
NAVER_SEARCH_CLIENT_SECRET

Client Secret은 브라우저에 절대 노출하면 안 되므로 이 프로젝트의 서버 API Route가 대신 호출합니다.

---

# 1. 기존 GitHub 프로젝트 업데이트

가장 쉬운 방법:

1. 이 ZIP을 압축 해제합니다.
2. 기존 GitHub Repository를 엽니다.
3. 아래 파일을 새 버전으로 교체합니다.

- package.json
- app/layout.js
- app/page.js
- app/globals.css
- components/JungGuMap.js

그리고 새 폴더/파일을 추가합니다.

- app/api/naver-place/route.js

`.env.local.example`과 이 안내문은 참고용이라 GitHub에 올려도 됩니다.

> 실제 Client Secret 값을 적은 `.env.local` 파일은 GitHub에 올리지 마세요.

GitHub에 Commit하면 Vercel이 자동으로 다시 배포합니다.

---

# 2. NAVER Maps Client ID 발급

NAVER Cloud Platform Console에서:

Services > Application Services > Maps > Application

1. Application 등록
2. Dynamic Map 또는 Web Dynamic Map 선택
3. Web 서비스 URL에 현재 Vercel 주소 등록

예시:
http://junggu-date-map-xxxxx.vercel.app

NAVER 안내상 http/https는 구분하지 않으므로 메인 도메인을 등록합니다.

4. 등록 후 Client ID 복사

Vercel:
Project > Settings > Environment Variables

Name:
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

Value:
발급받은 Client ID

저장합니다.

---

# 3. NAVER 지역검색 API 키 발급

developers.naver.com 에서:

Application > 애플리케이션 등록

사용 API에 '검색'을 포함합니다.

발급된:
- Client ID
- Client Secret

을 Vercel Environment Variables에 각각 등록합니다.

Name:
NAVER_SEARCH_CLIENT_ID

Name:
NAVER_SEARCH_CLIENT_SECRET

주의:
Client Secret에는 NEXT_PUBLIC_를 절대로 붙이면 안 됩니다.

---

# 4. Vercel 재배포

Vercel > Project > Deployments

최신 배포의 메뉴에서 Redeploy 하거나,
GitHub에 새 Commit을 하면 자동 배포됩니다.

---

# 5. 휴대전화에서 테스트

Vercel 주소를 휴대전화 Chrome/Safari에서 엽니다.

확인할 것:

1. NAVER 지도가 뜨는가
2. 도트 마커를 누르면 Bottom Sheet가 뜨는가
3. NAVER 장소정보가 표시되는가
4. 'NAVER에서 보기'가 동작하는가
5. '여기 다녀왔어요'를 누르면 위치 권한 요청이 뜨는가

실제로 장소에서 100m 이내일 때:
'실제로 이 장소를 방문하셨나요?' 팝업이 뜹니다.

---

# 현재 일부러 아직 안 넣은 것

- Supabase 회원 DB
- 카카오 로그인
- 공식 행정동 GeoJSON polygon
- 자동 장소 수집
- QR 인증
- 실제 시즌 사용자 집계
- 커플 계정 연결
- PWA 설치

이 기능들은 지도/장소/방문인증 흐름이 휴대폰에서 정상 작동하는 것을 확인한 다음 붙이는 것이 안전합니다.

---

# 현재 동 판정에 대한 주의

0.2도 아직 지도 중심점과 가장 가까운 행정동을 찾는 임시 방식입니다.

다음 0.3에서는 서울시 공식 행정동 경계 GeoJSON을 올려서:
- 실제 동 경계 색칠
- 정확한 현재 동 판정
- 개인 영토 채우기
를 구현하는 것이 다음 핵심 작업입니다.
