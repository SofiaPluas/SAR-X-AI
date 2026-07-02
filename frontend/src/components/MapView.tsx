import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";


export default function MapView() {

  const mapContainer = useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    if (!mapContainer.current) return;


    const map = new maplibregl.Map({

      container: mapContainer.current,

      style:
      "https://demotiles.maplibre.org/style.json",

      center: [
        -78.4678,
        -0.1807
      ],

      zoom: 13

    });



    new maplibregl.Marker({

      color: "red"

    })

    .setLngLat([
      -78.4678,
      -0.1807
    ])

    .setPopup(

      new maplibregl.Popup()

      .setHTML(
        `
        🚨 Posible sobreviviente
        <br>
        Confianza: 94%
        `
      )

    )

    .addTo(map);



    return () => map.remove();


  }, []);



  return (

    <div

      ref={mapContainer}

      style={{

        height:"500px",

        width:"100%"

      }}

    />

  );

}
