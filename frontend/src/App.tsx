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
      .then(setAlerts)
      .catch(console.error);
  }, []);

  // -----------------------------
  // TIEMPO REAL (YOLO)
  // -----------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/survivors");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAlerts((prev) => [
        ...prev,
        {
          id: Date.now(),
          latitude: data.latitude,
          longitude: data.longitude,
          probability: data.score,
          status: data.status,
        },
      ]);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

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
