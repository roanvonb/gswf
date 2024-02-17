import * as Cesium from "cesium";
import "./App.css";
import { Viewer } from "resium";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

function App() {
  return (
    <Viewer
      full
      timeline={false}
      animation={false}
      navigationHelpButton={false}
      homeButton={false}
      geocoder={false}
      fullscreenButton={false}
      projectionPicker={false}
      sceneModePicker={false}
      baseLayerPicker={false}
    />
  );
}

export default App;
