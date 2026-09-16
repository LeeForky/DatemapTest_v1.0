"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLACES = [
  {
    id: "deoksugung",
    name: "덕수궁",
    category: "궁궐·산책",
    dong: "소공동",
    lat: 37.5658,
    lng: 126.9751,
    icon: "🏯",
    intro: "돌담길과 함께 천천히 걷기 좋은 도심 궁궐 데이트.",
    tags: ["산책", "고궁", "사진"],
    points: 5
  },
  {
    id: "seoul_plaza",
    name: "서울광장",
    category: "공원·광장",
    dong: "소공동",
    lat: 37.5663,
    lng: 126.9780,
    icon: "🌳",
    intro: "시청 앞에서 계절 행사와 도심 풍경을 가볍게 즐기기 좋은 공간.",
    tags: ["산책", "계절행사", "도심"],
    points: 3
  },
  {
    id: "seoul_museum_art",
    name: "서울시립미술관 서소문본관",
    category: "전시·문화",
    dong: "소공동",
    lat: 37.5640,
    lng: 126.9737,
    icon: "🖼️",
    intro: "덕수궁 돌담길과 한 코스로 묶기 좋은 도심 전시 데이트 스팟.",
    tags: ["전시", "실내", "산책연계"],
    points: 5
  },
  {
    id: "myeongdong_cathedral",
    name: "명동성당",
    category: "랜드마크",
    dong: "명동",
    lat: 37.5632,
    lng: 126.9873,
    icon: "⛪",
    intro: "명동 한가운데에서 건축과 야경 분위기를 함께 즐기기 좋은 랜드마크.",
    tags: ["건축", "야경", "산책"],
    points: 4
  },
  {
    id: "bok_museum",
    name: "한국은행 화폐박물관",
    category: "전시·문화",
    dong: "명동",
    lat: 37.5621,
    lng: 126.9808,
    icon: "🏛️",
    intro: "명동·남대문 동선에 넣기 좋은 비교적 차분한 실내 전시 공간.",
    tags: ["박물관", "실내", "명동"],
    points: 4
  },
  {
    id: "namdaemun_market",
    name: "남대문시장",
    category: "시장·먹거리",
    dong: "회현동",
    lat: 37.5592,
    lng: 126.9777,
    icon: "🍜",
    intro: "시장 먹거리와 골목 구경을 함께 즐길 수 있는 중구 대표 생활형 데이트 코스.",
    tags: ["시장", "먹거리", "골목"],
    points: 5
  },
  {
    id: "culture_station_284",
    name: "문화역서울284",
    category: "전시·건축",
    dong: "중림동",
    lat: 37.5556,
    lng: 126.9717,
    icon: "🚉",
    intro: "옛 서울역 건축과 전시를 함께 볼 수 있어 서울역 데이트에 넣기 좋은 공간.",
    tags: ["전시", "건축", "서울역"],
    points: 5
  },
  {
    id: "namsangol",
    name: "남산골한옥마을",
    category: "전통·산책",
    dong: "필동",
    lat: 37.5593,
    lng: 126.9944,
    icon: "🏡",
    intro: "한옥과 정원을 천천히 걸으며 도심 속 전통 분위기를 즐기는 코스.",
    tags: ["한옥", "산책", "사진"],
    points: 5
  },
  {
    id: "euljiro_alley",
    name: "을지로 노가리골목",
    category: "먹거리·골목",
    dong: "을지로동",
    lat: 37.5662,
    lng: 126.9913,
    icon: "🍺",
    intro: "을지로 특유의 오래된 골목 분위기와 저녁 먹거리를 경험하는 곳.",
    tags: ["을지로", "골목", "저녁"],
    points: 5
  },
  {
    id: "ddp",
    name: "동대문디자인플라자 DDP",
    category: "전시·랜드마크",
    dong: "광희동",
    lat: 37.5665,
    lng: 127.0092,
    icon: "🎨",
    intro: "전시·팝업·야간 산책을 한 번에 묶기 좋은 동대문 대표 데이트 스팟.",
    tags: ["전시", "팝업", "야경"],
    points: 6
  },
  {
    id: "jangchungdan",
    name: "장충단공원",
    category: "공원·산책",
    dong: "장충동",
    lat: 37.5589,
    lng: 127.0065,
    icon: "🌿",
    intro: "장충동에서 잠깐 쉬거나 남산 방향으로 산책을 이어가기 좋은 공원.",
    tags: ["공원", "산책", "휴식"],
    points: 3
  },
  {
    id: "chungmu_art",
    name: "충무아트센터",
    category: "공연·문화",
    dong: "신당동",
    lat: 37.5659,
    lng: 127.0140,
    icon: "🎭",
    intro: "뮤지컬과 공연을 중심으로 저녁 데이트를 구성하기 좋은 문화공간.",
    tags: ["공연", "실내", "저녁"],
    points: 5
  },
  {
    id: "sindang_tteokbokki",
    name: "신당동 떡볶이타운",
    category: "먹거리",
    dong: "신당동",
    lat: 37.5642,
    lng: 127.0151,
    icon: "🌶️",
    intro: "즉석떡볶이를 중심으로 가볍고 캐주얼한 식사 데이트를 즐기는 거리.",
    tags: ["떡볶이", "먹거리", "캐주얼"],
    points: 4
  }
];

const DONGS = [
  "소공동","회현동","명동","필동","장충동","광희동","을지로동",
  "신당동","다산동","약수동","청구동","신당5동","동화동","황학동","중림동"
];

const DONG_CENTERS = [
  {name:"소공동", lat:37.5647, lng:126.9768},
  {name:"회현동", lat:37.5579, lng:126.9804},
  {name:"명동", lat:37.5617, lng:126.9868},
  {name:"필동", lat:37.5587, lng:126.9958},
  {name:"장충동", lat:37.5586, lng:127.0054},
  {name:"광희동", lat:37.5650, lng:127.0071},
  {name:"을지로동", lat:37.5662, lng:126.9955},
  {name:"신당동", lat:37.5658, lng:127.0130},
  {name:"다산동", lat:37.5547, lng:127.0084},
  {name:"약수동", lat:37.5528, lng:127.0103},
  {name:"청구동", lat:37.5572, lng:127.0140},
  {name:"신당5동", lat:37.5654, lng:127.0190},
  {name:"동화동", lat:37.5598, lng:127.0192},
  {name:"황학동", lat:37.5702, lng:127.0191},
  {name:"중림동", lat:37.5580, lng:126.9687}
];

function distanceMeters(aLat, aLng, bLat, bLng) {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function nearestDong(lat, lng) {
  let best = DONG_CENTERS[0];
  let dist = Infinity;

  DONG_CENTERS.forEach((d) => {
    const candidate = distanceMeters(lat, lng, d.lat, d.lng);
    if (candidate < dist) {
      best = d;
      dist = candidate;
    }
  });

  return best.name;
}

function naverMapSearchUrl(placeName) {
  return `https://map.naver.com/p/search/${encodeURIComponent(placeName)}`;
}

export default function JungGuMap() {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const mapListeners = useRef([]);
  const markerRefs = useRef([]);
  const [mapsReady, setMapsReady] = useState(false);
  const [selected, setSelected] = useState(PLACES[0]);
  const [currentDong, setCurrentDong] = useState("소공동");
  const [visited, setVisited] = useState([]);
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [naverInfo, setNaverInfo] = useState(null);
  const [naverLoading, setNaverLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("junggu_visited_v02") || "[]");
      setVisited(Array.isArray(saved) ? saved : []);
    } catch {
      setVisited([]);
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    if (!clientId) {
      setMessage("NAVER 지도 Client ID를 연결하면 실제 지도가 표시됩니다.");
      return;
    }

    if (window.naver?.maps) {
      setMapsReady(true);
      return;
    }

    window.navermap_authFailure = function () {
      setMessage("NAVER 지도 인증에 실패했습니다. Client ID와 등록 도메인을 확인해주세요.");
    };

    const existing = document.querySelector('script[data-naver-map="true"]');
    if (existing) {
      existing.addEventListener("load", () => setMapsReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.dataset.naverMap = "true";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.onload = () => setMapsReady(true);
    script.onerror = () => setMessage("NAVER 지도 스크립트를 불러오지 못했습니다.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapNode.current || mapRef.current || !window.naver?.maps) return;

    const naver = window.naver;

    const map = new naver.maps.Map(mapNode.current, {
      center: new naver.maps.LatLng(37.5637, 126.9960),
      zoom: 14,
      minZoom: 12,
      maxZoom: 20,
      zoomControl: false,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT
      }
    });

    mapRef.current = map;

    PLACES.forEach((place) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.lat, place.lng),
        map,
        title: place.name,
        icon: {
          content: `
            <button class="pixel-marker" aria-label="${place.name}" type="button">
              <span class="pixel-marker__icon">${place.icon}</span>
            </button>
          `,
          anchor: new naver.maps.Point(23, 23)
        }
      });

      const clickListener = naver.maps.Event.addListener(marker, "click", () => {
        selectPlace(place);
        map.panTo(new naver.maps.LatLng(place.lat, place.lng));
      });

      markerRefs.current.push(marker);
      mapListeners.current.push(clickListener);
    });

    const idleListener = naver.maps.Event.addListener(map, "idle", () => {
      const center = map.getCenter();
      setCurrentDong(nearestDong(center.lat(), center.lng()));
    });

    const mapClickListener = naver.maps.Event.addListener(map, "click", () => {
      setSheetOpen(false);
    });

    mapListeners.current.push(idleListener, mapClickListener);

    return () => {
      mapListeners.current.forEach((listener) => naver.maps.Event.removeListener(listener));
      markerRefs.current.forEach((marker) => marker.setMap(null));
      mapListeners.current = [];
      markerRefs.current = [];
      mapRef.current = null;
    };
  }, [mapsReady]);

  async function fetchNaverInfo(place) {
    setNaverLoading(true);
    setNaverInfo(null);

    try {
      const response = await fetch(`/api/naver-place?q=${encodeURIComponent(place.name)}`, {
        cache: "no-store"
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setNaverInfo({
          unavailable: true,
          setupRequired: Boolean(data.setupRequired),
          message: data.message || "NAVER 장소정보를 불러오지 못했습니다."
        });
        return;
      }

      const best =
        data.items?.find((item) =>
          item.roadAddress?.includes("서울특별시 중구") ||
          item.address?.includes("서울특별시 중구") ||
          item.roadAddress?.includes("서울 중구") ||
          item.address?.includes("서울 중구")
        ) || data.items?.[0];

      setNaverInfo(
        best
          ? { ...best, source: data.source }
          : { unavailable: true, message: "일치하는 NAVER 장소정보가 없습니다." }
      );
    } catch {
      setNaverInfo({
        unavailable: true,
        message: "NAVER 장소정보를 불러오는 중 오류가 발생했습니다."
      });
    } finally {
      setNaverLoading(false);
    }
  }

  function selectPlace(place) {
    setSelected(place);
    setCurrentDong(place.dong);
    setSheetOpen(true);
    setMessage("");
    fetchNaverInfo(place);
  }

  useEffect(() => {
    fetchNaverInfo(PLACES[0]);
  }, []);

  const dongStats = useMemo(() => {
    const result = {};
    DONGS.forEach((dong) => {
      const places = PLACES.filter((place) => place.dong === dong);
      const complete = places.filter((place) => visited.includes(place.id));
      const totalPoints = places.reduce((sum, place) => sum + place.points, 0);
      const earnedPoints = complete.reduce((sum, place) => sum + place.points, 0);

      result[dong] = {
        total: places.length,
        complete: complete.length,
        totalPoints,
        earnedPoints,
        progress: totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0
      };
    });
    return result;
  }, [visited]);

  const currentStats = dongStats[currentDong] || {
    total: 0,
    complete: 0,
    progress: 0,
    totalPoints: 0,
    earnedPoints: 0
  };

  const selectedVisited = visited.includes(selected.id);

  function goToMyLocation() {
    setMessage("");
    if (!navigator.geolocation) {
      setMessage("현재 브라우저에서는 위치 기능을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const here = new window.naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        mapRef.current?.panTo(here);
        mapRef.current?.setZoom(17);
        setMessage(`현재 위치를 표시했습니다. GPS 정확도 ±${Math.round(position.coords.accuracy)}m`);
      },
      () => setMessage("위치 권한을 허용해야 현재 위치를 확인할 수 있습니다."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function verifyVisit(place) {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("현재 브라우저에서는 위치 확인을 지원하지 않습니다.");
      return;
    }

    setMessage("현재 위치를 확인하고 있습니다…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = distanceMeters(
          position.coords.latitude,
          position.coords.longitude,
          place.lat,
          place.lng
        );
        const accuracy = Math.round(position.coords.accuracy || 999);

        if (distance <= 100 && accuracy <= 180) {
          setConfirming({
            place,
            distance: Math.round(distance),
            accuracy
          });
          setMessage("");
        } else {
          setMessage(
            `현재 장소에서 약 ${Math.round(distance)}m 떨어져 있습니다. GPS 정확도 ±${accuracy}m`
          );
        }
      },
      () => setMessage("위치 권한을 허용해야 방문 인증을 할 수 있습니다."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function confirmVisit() {
    const place = confirming.place;
    const next = Array.from(new Set([...visited, place.id]));
    setVisited(next);
    localStorage.setItem("junggu_visited_v02", JSON.stringify(next));
    setConfirming(null);
    setMessage(`${place.name} 방문 완료 · ${place.dong} 탐험 +${place.points}P`);
  }

  function focusDong(dong) {
    const center = DONG_CENTERS.find((item) => item.name === dong);
    setCurrentDong(dong);

    if (center && mapRef.current && window.naver?.maps) {
      mapRef.current.panTo(new window.naver.maps.LatLng(center.lat, center.lng));
      mapRef.current.setZoom(15);
    }
  }

  return (
    <main className="app-shell">
      <header className="hud">
        <div>
          <p className="eyebrow">SEOUL DATE COLLECTION · JUNG-GU</p>
          <h1>{currentDong}</h1>
          <p className="hud-copy">오늘은 이 동네를 얼마나 채워볼까요?</p>
        </div>

        <div className="progress">
          <div className="progress-row">
            <strong>{currentStats.progress}%</strong>
            <span>{currentStats.complete}/{currentStats.total || 0}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${currentStats.progress}%` }} />
          </div>
          <small>{currentStats.earnedPoints}/{currentStats.totalPoints} 탐험 P</small>
        </div>
      </header>

      <section className="season">
        <div className="season-icon">☀️</div>
        <div>
          <small>이번 시즌 · 취향 영토전</small>
          <b>여름파 52% · 겨울파 48%</b>
        </div>
        <span className="season-pill">D-8</span>
      </section>

      <section className="map-area">
        {!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID && (
          <div className="map-fallback">
            <span className="fallback-badge">NAVER MAP 연결 전</span>
            <h2>서울특별시 중구</h2>
            <p>API 키를 연결하면 이 영역에 실제 네이버지도가 표시됩니다.</p>
            <div className="fallback-places">
              {PLACES.slice(0, 8).map((place) => (
                <button key={place.id} onClick={() => selectPlace(place)}>
                  <span>{place.icon}</span>
                  {place.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={mapNode} className="naver-map" />

        <button className="location-button" onClick={goToMyLocation} aria-label="현재 위치">
          ◎
        </button>

        <div className="map-mode">
          <button className="active">탐험</button>
          <button>내 지도</button>
        </div>

        {message && <div className="toast">{message}</div>}
      </section>

      <section className={`bottom-sheet ${sheetOpen ? "open" : "closed"}`}>
        <button className="sheet-handle" onClick={() => setSheetOpen(!sheetOpen)} aria-label="장소 카드 열기">
          <span />
        </button>

        <div className="place-heading">
          <div className="place-icon">{selected.icon}</div>
          <div className="place-title">
            <div className="place-meta">{selected.dong} · {selected.category}</div>
            <h2>{selected.name}</h2>
          </div>
          <div className={`visit-state ${selectedVisited ? "complete" : ""}`}>
            {selectedVisited ? "✓ 방문" : "미방문"}
          </div>
        </div>

        <p className="our-intro">{selected.intro}</p>

        <div className="tags">
          {selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          <span className="point-tag">+{selected.points}P</span>
        </div>

        <div className="sheet-section">
          <div className="section-label">
            <span>NAVER 장소정보</span>
            <small>출처: NAVER 지역검색</small>
          </div>

          {naverLoading && (
            <div className="naver-card loading">
              NAVER 장소정보를 불러오는 중…
            </div>
          )}

          {!naverLoading && naverInfo && !naverInfo.unavailable && (
            <div className="naver-card">
              <b>{naverInfo.title || selected.name}</b>
              {naverInfo.category && <span>{naverInfo.category}</span>}
              {naverInfo.description && <p>{naverInfo.description}</p>}
              <small>{naverInfo.roadAddress || naverInfo.address}</small>
            </div>
          )}

          {!naverLoading && naverInfo?.unavailable && (
            <div className="naver-card unavailable">
              <b>{naverInfo.setupRequired ? "지역검색 API 연결 전" : "장소정보 없음"}</b>
              <span>{naverInfo.message}</span>
            </div>
          )}
        </div>

        <div className="sheet-actions">
          <button
            className="visit-button"
            disabled={selectedVisited}
            onClick={() => verifyVisit(selected)}
          >
            {selectedVisited ? "✓ 방문 완료" : "📍 여기 다녀왔어요"}
          </button>

          <a
            className="naver-link"
            href={naverInfo?.link || naverMapSearchUrl(selected.name)}
            target="_blank"
            rel="noreferrer"
          >
            NAVER에서 보기 ↗
          </a>
        </div>
      </section>

      <section className="dong-collection">
        <div className="collection-title">
          <h3>중구 컬렉션</h3>
          <small>동네를 눌러 지도를 이동하세요.</small>
        </div>

        <div className="dong-scroll">
          {DONGS.map((dong) => {
            const stats = dongStats[dong];
            return (
              <button
                key={dong}
                onClick={() => focusDong(dong)}
                className={dong === currentDong ? "dong-chip active" : "dong-chip"}
              >
                <b>{dong}</b>
                <span>{stats.progress}%</span>
              </button>
            );
          })}
        </div>
      </section>

      <nav className="tabbar">
        <button>
          <span>🗺️</span>
          <small>내 지도</small>
        </button>
        <button className="active">
          <span>🔭</span>
          <small>탐험</small>
        </button>
        <button>
          <span>🏁</span>
          <small>시즌</small>
        </button>
        <button>
          <span>👤</span>
          <small>MY</small>
        </button>
      </nav>

      {confirming && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <div className="confirm-pin">📍</div>
            <h3>{confirming.place.name} 근처입니다</h3>
            <p>
              장소에서 약 <b>{confirming.distance}m</b> 거리로 확인되었습니다.
              <br />
              실제로 이 장소를 방문하셨나요?
            </p>
            <small>GPS 정확도 ±{confirming.accuracy}m</small>
            <button className="confirm-button" onClick={confirmVisit}>
              네, 방문했어요
            </button>
            <button className="cancel-button" onClick={() => setConfirming(null)}>
              취소
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
