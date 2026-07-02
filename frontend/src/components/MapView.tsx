import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-78.4678, -0.1807],
      zoom: 12
    });

    // 🔥 CARGAR ALERTAS DESDE TU API
    fetch("https://sar-x-ai.onrender.com/detections")
      .then(res => res.json())
      .then(data => {

        data.forEach((d: any) => {

          new maplibregl.Marker({ color: "red" })
            .setLngLat([d.longitude, d.latitude])
            .setPopup(
              new maplibregl.Popup().setHTML(`
                🚨 Alerta SAR-X AI<br/>
                Probabilidad: ${d.probability}%<br/>
                Estado: ${d.status ?? "pending"}
              `)
            )
            .addTo(map);

        });

      });

    return () => map.remove();

  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: "500px", width: "100%" }}
    />
  );
}
