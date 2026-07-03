import { useEffect, useRef, useState } from "react";
import MapView from "./components/MapView";
import AlertPanel from "./components/AlertPanel";
import { Detection } from "./types";

export default function App() {
  const [alerts, setAlerts] = useState<Detection[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Detection | null>(null);

  const mapRef = useRef<any>(null);

  // -----------------------------
  // CARGA INICIAL (DB)
  // -----------------------------
  useEffect(() => {
    fetch("https://sar-x-ai.onrender.com/detections")
      .then((res) => res.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // -----------------------------
  // TIEMPO REAL (YOLO WEBSOCKET)
  // -----------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/yolo");

    ws.onopen = () => {
      console.log("🟢 WebSocket conectado");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setAlerts((prev) => [
          ...prev,
          {
            id: Date.now(),
            latitude: data.latitude ?? -0.18,
            longitude: data.longitude ?? -78.55,
            probability: data.survivor_score ?? data.score ?? 0,
            status: data.status ?? "pending",
          },
        ]);
      } catch (err) {
        console.error("Error parsing WS:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket cerrado");
    };

    return () => ws.close();
  }, []);

  // -----------------------------
  // SELECCIÓN DE ALERTA
  // -----------------------------
  const handleSelectAlert = (alert: Detection) => {
    setSelectedAlert(alert);

    mapRef.current?.flyTo({
      center: [alert.longitude, alert.latitude],
      zoom: 14,
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        SAR-X AI - Centro de Mando
      </h1>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            alerts={alerts}
            selectedAlert={selectedAlert}
          />
        </div>

        <AlertPanel
          alerts={alerts}
          onSelectAlert={handleSelectAlert}
        />
      </div>
    </div>
  );
}
