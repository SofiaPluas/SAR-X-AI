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
  ({ alerts, selectedAlert }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);
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

    // Dibujar marcadores
    useEffect(() => {
      if (!mapInstance.current) return;

      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      alerts.forEach((alert) => {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <b>🚨 Alerta SAR-X AI</b><br/>
          <b>ID:</b> ${alert.id}<br/>
          <b>Confianza:</b> ${alert.probability}%<br/>
          <b>Estado:</b> ${alert.status}
        `);

        const marker = new maplibregl.Marker({
          color: "red",
        })
          .setLngLat([alert.longitude, alert.latitude])
          .setPopup(popup)
          .addTo(mapInstance.current!);

        markers.current.push(marker);
      });
    }, [alerts]);

    // Centrar el mapa cuando se selecciona una alerta
    useEffect(() => {
      if (!mapInstance.current || !selectedAlert) return;

      mapInstance.current.flyTo({
        center: [selectedAlert.longitude, selectedAlert.latitude],
        zoom: 15,
        essential: true,
      });

      markers.current.forEach((marker) => {
        const lngLat = marker.getLngLat();

        if (
          lngLat.lng === selectedAlert.longitude &&
          lngLat.lat === selectedAlert.latitude
        ) {
          marker.togglePopup();
        }
      });
    }, [selectedAlert]);

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

MapView.displayName = "MapView";

export default MapView;
