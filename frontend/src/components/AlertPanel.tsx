
import { Detection } from "../types";

interface Props {
  alerts: Detection[];
  onSelectAlert: (alert: Detection) => void;
}

export default function AlertPanel({ alerts, onSelectAlert }: Props) {

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
            onClick={() => onSelectAlert(alert)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
          >
            <strong>Alerta #{alert.id}</strong>

            <p>Confianza: {alert.probability}%</p>
            <p>Estado: {alert.status}</p>

            <p>
              {alert.latitude}, {alert.longitude}
            </p>
          </div>
        ))
      )}

    </div>
  );
}
