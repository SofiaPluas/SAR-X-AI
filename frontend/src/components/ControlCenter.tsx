import { useEffect, useState, useRef } from "react";
import AlertPanel from "./AlertPanel";
import MapView from "./MapView";

interface Detection {
  id: number;
  latitude: number;
  longitude: number;
  probability: number;
  status: string;
}

export default function ControlCenter() {

  // 🧠 CEREBRO DEL SISTEMA
  const [alerts, setAlerts] = useState<Detection[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Detection | null>(null);

  // 🗺️ referencia del mapa
  const mapRef = useRef<any>(null);

  // 📡 cargar alertas desde API
  useEffect(() => {
    fetch("https://sar-x-ai.onrender.com/detections")
      .then(res => res.json())
      .then(setAlerts)
      .catch(err => console.error("Error:", err));
  }, []);

  // 🎯 click en alerta → mover mapa
  const handleSelectAlert = (alert: Detection) => {
    setSelectedAlert(alert);

    mapRef.current?.flyTo({
      center: [alert.longitude, alert.latitude],
      zoom: 14
    });
  };

  return (
    <div style={{ display: "flex" }}>

      {/* 🗺️ MAPA */}
      <MapView
        ref={mapRef}
        alerts={alerts}
        selectedAlert={selectedAlert}
      />

      {/* 🚨 PANEL */}
      <AlertPanel
        alerts={alerts}
        onSelectAlert={handleSelectAlert}
      />

    </div>
  );
}
