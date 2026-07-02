import { useEffect, useRef, useState } from "react";
import MapView from "./components/MapView";
import AlertPanel from "./components/AlertPanel";
import { Detection } from "./types";

export default function App() {
  const [alerts, setAlerts] = useState<Detection[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Detection | null>(null);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch("https://sar-x-ai.onrender.com/detections")
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

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
