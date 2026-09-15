# 서울 중구 데이트맵 MVP 0.1

코딩을 모르는 상태에서도 첫 테스트를 할 수 있도록 만든 모바일 우선 웹 프로토타입입니다.

## 현재 구현된 기능

- 서울특별시 중구 중심 Google 지도
- 중구 15개 행정동 UI
- 지도 이동 후 가까운 행정동 이름을 상단에 표시하는 샘플 로직
- 중구 샘플 장소 마커
- 장소 선택
- 모바일 GPS 위치 확인
- 장소 반경 100m 안에 있을 때 사용자에게 실제 방문 여부 확인
- "네, 방문했어요"를 누르면 방문 저장
- 방문 데이터는 현재 브라우저 localStorage에 저장
- 동별 탐험도 표시
- 모바일 하단 내비게이션 UI
- 파스텔 + 레트로 게임 느낌의 기본 디자인

현재 행정동 판정은 MVP 테스트를 위한 '가장 가까운 동 중심점' 방식입니다.
실제 서비스에서는 서울시 행정동 경계 GeoJSON polygon으로 교체해야 합니다.

## Google 지도 연결 방법

1. Google Cloud Console에서 프로젝트 생성
2. 결제 계정 연결
3. Maps JavaScript API 활성화
4. API 키 발급
5. `.env.local.example` 파일을 복사하여 `.env.local`로 이름 변경
6. 아래처럼 키 입력

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=발급받은키

Google Maps의 Advanced Marker를 사용하기 위해 지도는 `DEMO_MAP_ID`로 테스트합니다.
실서비스에서는 본인의 Map ID를 만드는 것이 좋습니다.

## 내 컴퓨터에서 실행

Node.js가 설치되어 있다면 프로젝트 폴더에서:

npm install
npm run dev

브라우저에서:
http://localhost:3000

GPS 기능은 실제 휴대폰에서 HTTPS 주소로 테스트하는 편이 좋습니다.

## Vercel에 올리는 가장 쉬운 흐름

1. GitHub 계정을 만든다.
2. 새 Repository를 만든다.
3. 이 폴더 안의 파일을 업로드한다.
4. Vercel에 GitHub 계정으로 로그인한다.
5. `Add New Project`에서 Repository를 선택한다.
6. Environment Variables에 다음을 등록한다.

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 본인의 Google API 키

7. Deploy를 누른다.
8. 발급된 `https://....vercel.app` 주소를 휴대폰에서 연다.
9. 방문 인증 시 위치 권한을 허용한다.

## 다음 버전

1. 공식 행정동 GeoJSON 경계 적용
2. Google Places API로 실제 식당/카페/콘텐츠 불러오기
3. Supabase에 방문 데이터 저장
4. 카카오 로그인
5. 개인 탐험도 규칙 확정
6. 시즌 A/B 그룹전
7. QR 인증
8. PWA 설치 기능

현재 장소 좌표와 행정동 분류는 UI/기능 검증용 샘플입니다.
실제 출시 전에 Google Places와 공식 행정경계 데이터로 재검증해야 합니다.
