import { useEffect } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";


export default function MapView() {


  useEffect(() => {


    const map = new maplibregl.Map({

      container: "map",

      style: "https://demotiles.maplibre.org/style.json",

      center: [

        -78.46,

        -0.18

      ],

      zoom: 14

    });



    fetch("http://127.0.0.1:8000/detections")

      .then(res => res.json())

      .then(data => {


        data.forEach((d: any) => {


          new maplibregl.Marker({

            color: "red"

          })


          .setLngLat([

            d.longitude,

            d.latitude

          ])


          .setPopup(

            new maplibregl.Popup()

              .setHTML(`

                <h3>🚨 Posible sobreviviente</h3>

                <p>

                Probabilidad:

                ${d.probability}%

                </p>

              `)

          )


          .addTo(map);


        });


      });



    return () => map.remove();


  }, []);



  return (

    <div

      id="map"

      style={{

        width: "100%",

        height: "100vh"

      }}

    />

  );


}
