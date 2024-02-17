import * as Cesium from "cesium";
import { Viewer } from "resium";
import { useMemo } from 'react';


Cesium.Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

function App() {
  const terrainProvider = useMemo(
    async () => await Cesium.createWorldTerrainAsync(),
    []
  );

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
      terrainProvider={terrainProvider}
    />
  );
}

export default App;
