import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Detection {
  id: number;
  latitude: number;
  longitude: number;
  probability: number;
  status: string;
}

interface MapViewProps {
  alerts: Detection[];
  selectedAlert: Detection | null;
}

const MapView = forwardRef<maplibregl.Map | null, MapViewProps>(
  ({ alerts }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);

    // Crear el mapa una sola vez
    useEffect(() => {
      if (!mapContainer.current) return;

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [-78.4678, -0.1807],
        zoom: 12,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      mapInstance.current = map;

      return () => {
        map.remove();
      };
    }, []);

    // Exponer el mapa al componente padre
    useImperativeHandle(ref, () => mapInstance.current);

    // Dibujar marcadores cada vez que cambien las alertas
    useEffect(() => {
      if (!mapInstance.current) return;

      // Borrar marcadores anteriores
      markers.current.forEach((m) => m.remove());
      markers.current = [];

      alerts.forEach((d) => {
        const marker = new maplibregl.Marker({ color: "red" })
          .setLngLat([d.longitude, d.latitude])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <b>🚨 Alerta SAR-X AI</b><br/>
              Probabilidad: ${d.probability}%<br/>
              Estado: ${d.status}
            `)
          )
          .addTo(mapInstance.current!);

        markers.current.push(marker);
      });
    }, [alerts]);

    return (
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "500px",
        }}
      />
    );
  }
);

export default MapView;
