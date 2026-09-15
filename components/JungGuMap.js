"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLACES = [
  { id:"deoksugung", name:"덕수궁", category:"데이트스팟", dong:"소공동", lat:37.5658, lng:126.9751, icon:"🏯" },
  { id:"seoul_plaza", name:"서울광장", category:"공원·광장", dong:"소공동", lat:37.5663, lng:126.9780, icon:"🌳" },
  { id:"myeongdong_cathedral", name:"명동성당", category:"랜드마크", dong:"명동", lat:37.5632, lng:126.9873, icon:"⛪" },
  { id:"bok_museum", name:"한국은행 화폐박물관", category:"전시·문화", dong:"명동", lat:37.5621, lng:126.9808, icon:"🏛️" },
  { id:"namsangol", name:"남산골한옥마을", category:"데이트스팟", dong:"필동", lat:37.5593, lng:126.9944, icon:"🏡" },
  { id:"ddp", name:"동대문디자인플라자 DDP", category:"전시·문화", dong:"광희동", lat:37.5665, lng:127.0092, icon:"🎨" },
  { id:"chungmu_art", name:"충무아트센터", category:"공연·문화", dong:"신당동", lat:37.5659, lng:127.0140, icon:"🎭" },
  { id:"namdaemun", name:"남대문시장", category:"시장·먹거리", dong:"회현동", lat:37.5592, lng:126.9777, icon:"🍜" },
  { id:"jangchungdan", name:"장충단공원", category:"공원·산책", dong:"장충동", lat:37.5589, lng:127.0065, icon:"🌿" }
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
    const v = distanceMeters(lat, lng, d.lat, d.lng);
    if (v < dist) { best = d; dist = v; }
  });
  return best.name;
}

export default function JungGuMap() {
  const mapNode = useRef(null);
  const mapObj = useRef(null);
  const markers = useRef([]);
  const [selected, setSelected] = useState(PLACES[0]);
  const [currentDong, setCurrentDong] = useState("명동");
  const [message, setMessage] = useState("");
  const [visited, setVisited] = useState([]);
  const [mapsReady, setMapsReady] = useState(false);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("junggu_visited") || "[]");
    setVisited(saved);

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setMessage("Google Maps API 키를 설정하면 실제 지도가 표시됩니다.");
      return;
    }

    if (window.google?.maps) {
      setMapsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker&v=weekly`;
    script.async = true;
    script.onload = () => setMapsReady(true);
    script.onerror = () => setMessage("Google Maps를 불러오지 못했습니다. API 설정을 확인해주세요.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapNode.current || mapObj.current) return;
    const map = new window.google.maps.Map(mapNode.current, {
      center: { lat: 37.5636, lng: 126.9976 },
      zoom: 14,
      mapId: "DEMO_MAP_ID",
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy"
    });
    mapObj.current = map;

    const createMarkers = async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      PLACES.forEach((p) => {
        const content = document.createElement("button");
        content.className = "pixel-marker";
        content.innerHTML = `<span>${p.icon}</span>`;
        content.title = p.name;
        content.onclick = () => {
          setSelected(p);
          map.panTo({lat:p.lat,lng:p.lng});
        };
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat:p.lat, lng:p.lng },
          content,
          title:p.name
        });
        markers.current.push(marker);
      });
    };
    createMarkers();

    let timer;
    map.addListener("idle", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const c = map.getCenter();
        if (c) setCurrentDong(nearestDong(c.lat(), c.lng()));
      }, 350);
    });
  }, [mapsReady]);

  const dongStats = useMemo(() => {
    const obj = {};
    DONGS.forEach((d) => {
      const inDong = PLACES.filter(p => p.dong === d);
      const done = inDong.filter(p => visited.includes(p.id));
      obj[d] = { total: inDong.length, done: done.length };
    });
    return obj;
  }, [visited]);

  const current = dongStats[currentDong] || {done:0,total:0};
  const progress = current.total ? Math.round(current.done/current.total*100) : 0;

  function verifyVisit(place) {
    setMessage("");
    if (!navigator.geolocation) {
      setMessage("이 브라우저에서는 위치 확인을 지원하지 않습니다.");
      return;
    }
    setMessage("현재 위치를 확인하고 있습니다…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          place.lat,
          place.lng
        );
        const accuracy = Math.round(pos.coords.accuracy || 999);
        if (d <= 100 && accuracy <= 180) {
          setMessage(`장소에서 약 ${Math.round(d)}m 거리입니다.`);
          setConfirming({ place, distance:Math.round(d), accuracy });
        } else {
          setMessage(`현재 장소에서 약 ${Math.round(d)}m 떨어져 있어 방문 인증이 어렵습니다. GPS 정확도 ±${accuracy}m`);
        }
      },
      () => setMessage("위치 권한을 허용해야 방문 인증을 할 수 있습니다."),
      { enableHighAccuracy:true, timeout:10000, maximumAge:0 }
    );
  }

  function confirmVisit() {
    const place = confirming.place;
    const next = Array.from(new Set([...visited, place.id]));
    setVisited(next);
    localStorage.setItem("junggu_visited", JSON.stringify(next));
    setConfirming(null);
    setMessage(`${place.name} 방문이 기록되었습니다.`);
  }

  const done = visited.includes(selected.id);

  return (
    <main className="phone-shell">
      <section className="top-card">
        <div>
          <p className="eyebrow">SEOUL DATE COLLECTION</p>
          <h1>{currentDong} 탐험</h1>
          <p className="sub">중구의 동네를 하나씩 채워보세요.</p>
        </div>
        <div className="progress-box">
          <strong>{progress}%</strong>
          <div className="bar"><span style={{width:`${progress}%`}} /></div>
          <small>{current.done}/{current.total || 0} 방문</small>
        </div>
      </section>

      <section className="season-card">
        <span>🏁 이번 시즌</span>
        <b>☕ 카페파 52% · 🍽 맛집파 48%</b>
        <small>가볍게 보는 샘플 시즌 데이터</small>
      </section>

      <section className="map-wrap">
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="map-fallback">
            <div className="fallback-title">서울특별시 중구</div>
            <div className="fallback-grid">
              {PLACES.map(p => (
                <button key={p.id} onClick={() => {setSelected(p);setCurrentDong(p.dong)}} className="fallback-pin">
                  <span>{p.icon}</span>{p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={mapNode} className="map-node" />
      </section>

      <section className="place-sheet">
        <div className="place-main">
          <span className="big-icon">{selected.icon}</span>
          <div>
            <small>{selected.dong} · {selected.category}</small>
            <h2>{selected.name}</h2>
          </div>
          <span className={done ? "badge done" : "badge"}>{done ? "방문완료" : "미방문"}</span>
        </div>

        <button className="visit-button" onClick={() => verifyVisit(selected)} disabled={done}>
          {done ? "✓ 이미 방문한 장소입니다" : "📍 여기 다녀왔어요"}
        </button>

        {message && <p className="status-message">{message}</p>}
      </section>

      <section className="dong-strip">
        <h3>중구 탐험 현황</h3>
        <div className="chips">
          {DONGS.map(d => {
            const s = dongStats[d];
            const p = s.total ? Math.round(s.done/s.total*100) : 0;
            return (
              <button key={d} onClick={() => setCurrentDong(d)} className={d===currentDong ? "chip active" : "chip"}>
                {d} <small>{p}%</small>
              </button>
            )
          })}
        </div>
      </section>

      <nav className="bottom-nav">
        <button>🗺️<span>내 지도</span></button>
        <button className="active">🔭<span>탐험</span></button>
        <button>🏁<span>시즌</span></button>
        <button>👤<span>MY</span></button>
      </nav>

      {confirming && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-icon">📍</div>
            <h3>{confirming.place.name} 근처입니다</h3>
            <p>현재 약 {confirming.distance}m 거리로 확인되었습니다.<br/>실제로 이 장소를 방문하셨나요?</p>
            <button className="confirm" onClick={confirmVisit}>네, 방문했어요</button>
            <button className="cancel" onClick={() => setConfirming(null)}>취소</button>
          </div>
        </div>
      )}
    </main>
  );
}
