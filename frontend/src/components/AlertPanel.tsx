import { useEffect, useState } from "react";

interface Detection {
  id: number;
  latitude: number;
  longitude: number;
  probability: number;
  status: string;
}

export default function AlertPanel() {

  const [alerts, setAlerts] = useState<Detection[]>([]);

  async function loadAlerts() {
    try {
      const response = await fetch(
        "https://sar-x-ai.onrender.com/detections"
      );

      const data = await response.json();

console.log("Alertas recibidas:", data);

setAlerts(data);

    } catch (error) {
      console.error("Error cargando alertas:", error);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div
      style={{
        width: "320px",
        padding: "15px",
        background: "#ffffff",
        borderLeft: "1px solid #ddd",
        overflowY: "auto",
        height: "100vh"
      }}
    >
      <h2>🚨 Alertas</h2>

      {alerts.length === 0 ? (
        <p>No hay alertas.</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <strong>Alerta #{alert.id}</strong>

            <p>Confianza: {alert.probability}%</p>

            <p>Estado: {alert.status}</p>

            <p>
              {alert.latitude},
              {alert.longitude}
            </p>
          </div>
        ))
      )}

    </div>
  );

}
