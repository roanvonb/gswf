import * as Cesium from 'cesium';
import { useEffect, useMemo, useRef } from 'react';
import {
    CameraFlyTo,
    Entity,
    LabelGraphics,
    PointGraphics,
    Viewer,
} from 'resium';

Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMjk2NDNlYy1jMGY4LTQyOGQtODViOS0yMDExMjY2MjhlMzgiLCJpZCI6MTk0NzkzLCJpYXQiOjE3MDc0NDkzMzF9.wLU9C7Vm0ufrWaBkz43QRCRJbUwrQQHH6MqKzlNEL2c';

const default_compound_position = Cesium.Cartesian3.fromDegrees(138.910467565, -33.804836895);
const default_camera_position = Cesium.Cartesian3.fromDegrees(138.95, -33.77, 25000);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchTerrain = async (ref) => {
    if (ref.current && ref.current.cesiumElement) {
        ref.current.cesiumElement.extend(Cesium.viewerDragDropMixin);
        ref.current.cesiumElement.terrainProvider = await Cesium.createWorldTerrainAsync();

    }
    else {
        await sleep(1000);
        fetchTerrain(ref);
    }

}

const fetch_kml = async (ref, ion_id, color, width) => {
    if (ref.current && ref.current.cesiumElement) {
        const url = await Cesium.IonResource.fromAssetId(ion_id);
        const kml = await Cesium.KmlDataSource.load(url, { clampToGround: true });

        for (const entity of kml.entities.values) {
            if (entity.polyline) {
                if (width){
                    entity.polyline.width = width;
                }
                
                if (color){
                    entity.polyline.material = new Cesium.ColorMaterialProperty(color)
                }
                
            }
        }

        ref.current?.cesiumElement.dataSources.add(kml);

    }
    else {
        await sleep(1000);
        fetch_kml(ref, ion_id, color, width);
    }

}

export function ResiumViewer() {

    const ref = useRef(null);

    useEffect(() => {
        fetchTerrain(ref);
        fetch_kml(ref, 2496167, null, 2); // design
        // fetch_kml(ref, 2464856, Cesium.Color.BLUE, 2); // asbuilt

    }, []);

    return (
        <Viewer
            ref={ref}
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
