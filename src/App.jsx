import * as Cesium from "cesium";
import { CameraFlyTo, Entity, LabelGraphics, PointGraphics, Viewer } from 'resium';
import { useEffect, useMemo, useRef } from 'react';


Cesium.Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

const default_compound_position = Cesium.Cartesian3.fromDegrees(138.910467565, -33.804836895);
const default_camera_position = Cesium.Cartesian3.fromDegrees(138.95, -33.77, 25000);


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  // const terrainProvider = useMemo(
  //   async () => await Cesium.createWorldTerrainAsync(),
  //   []
  // );
  const ref = useRef(null);

  async function fetchKml() {
    if (ref.current?.cesiumElement) {
      const url = await Cesium.IonResource.fromAssetId(2462247);
      const kml = await Cesium.KmlDataSource.load(url, { clampToGround: true });
      ref.current?.cesiumElement.dataSources.add(kml);

    } else {
      await sleep(1000);
      await fetchKml();
    }
  }

  useEffect(() => {
    fetchKml();
  });

  return (
    <Viewer
      full
      ref={ref}
      timeline={false}
      animation={false}
      navigationHelpButton={false}
      homeButton={false}
      geocoder={false}
      fullscreenButton={false}
      projectionPicker={false}
      sceneModePicker={false}
      baseLayerPicker={false}
    // terrainProvider={terrainProvider}
    >
      <Entity position={default_compound_position} name="Main Compound">
        <PointGraphics pixelSize={10} heightReference={Cesium.HeightReference.CLAMP_TO_GROUND} />
        <LabelGraphics
          text="Main Compound"
          verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
          pixelOffset={new Cesium.Cartesian2(0, -9)}
          font="14pt monospace"
          style={Cesium.LabelStyle.FILL_AND_OUTLINE}
          heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
        />
      </Entity>
      <CameraFlyTo destination={default_camera_position} />
    </Viewer>
  );
}

export default App;
