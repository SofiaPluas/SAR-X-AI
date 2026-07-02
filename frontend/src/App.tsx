import MapView from "./components/MapView";
import AlertPanel from "./components/AlertPanel";

function App() {

  return (

    <div>

      <h1
        style={{
          textAlign: "center"
        }}
      >
        SAR-X AI - Centro de Mando
      </h1>

      <div
        style={{
          display: "flex"
        }}
      >

        <div
          style={{
            flex: 1
          }}
        >
          <MapView />
        </div>

        <AlertPanel />

      </div>

    </div>

  );

}

export default App;
