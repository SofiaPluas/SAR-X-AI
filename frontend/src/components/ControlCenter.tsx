import { useEffect, useState, useRef } from "react";

interface Detection {
  id: number;
  latitude: number;
  longitude: number;
  probability: number;
  status: string;
}

export default function ControlCenter() {

  // 🧠 estado global
  const [alerts, setAlerts] = useState<Detection[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Detection | null>(null);

  // 🗺️ referencia del mapa
  const mapRef = useRef<any>(null);

  // 📡 FETCH GLOBAL (AQUÍ VA)
  useEffect(() => {
    fetch("https://sar-x-ai.onrender.com/detections")
      .then(res => res.json())
      .then(setAlerts)
      .catch(err => console.error("Error cargando alertas:", err));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* mapa y panel aquí */}
    </div>
  );
}
