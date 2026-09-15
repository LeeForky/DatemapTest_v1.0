import "./globals.css";

export const metadata = {
  title: "서울 중구 데이트맵",
  description: "GPS 방문 인증 기반 서울 중구 데이트 컬렉션 MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
