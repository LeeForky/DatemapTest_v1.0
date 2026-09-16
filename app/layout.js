import "./globals.css";

export const metadata = {
  title: "서울 중구 데이트맵",
  description: "서울 중구를 데이트하며 채워가는 모바일 컬렉션 지도"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
