import { NextResponse } from "next/server";

function stripTags(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json(
      { ok: false, message: "검색할 장소명이 없습니다." },
      { status: 400 }
    );
  }

  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        ok: false,
        setupRequired: true,
        message: "NAVER 지역검색 API 키가 아직 연결되지 않았습니다."
      },
      { status: 503 }
    );
  }

  const query = encodeURIComponent(`${q} 서울 중구`);
  const endpoint =
    `https://openapi.naver.com/v1/search/local.json?query=${query}&display=3&start=1&sort=random`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const raw = await response.text();
      return NextResponse.json(
        {
          ok: false,
          message: `NAVER 지역검색 요청 실패 (${response.status})`,
          detail: raw.slice(0, 300)
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    const normalized = items.map((item) => ({
      title: stripTags(item.title),
      category: stripTags(item.category),
      description: stripTags(item.description),
      address: stripTags(item.address),
      roadAddress: stripTags(item.roadAddress),
      link: item.link || "",
      mapx: item.mapx || "",
      mapy: item.mapy || ""
    }));

    return NextResponse.json({
      ok: true,
      source: "NAVER 지역검색",
      items: normalized
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "NAVER 지역검색 API 연결 중 오류가 발생했습니다.",
        detail: String(error)
      },
      { status: 500 }
    );
  }
}
