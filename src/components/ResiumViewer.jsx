import * as Cesium from 'cesium';
import { useEffect, useMemo, useRef } from 'react';
import {
    BillboardGraphics,
    CameraFlyTo,
    Entity,
    KmlDataSource,
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

function showUserLocation(position,ref) {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    if (ref.current && ref.current.cesiumElement) {
        ref.current.cesiumElement.entities.add(
            {
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            heightReference: Cesium.HeightReference.CLAMP_TO_TERRAIN,
            point: {
                pixelSize:8,
                outlineWidth:2,
                outlineColor:Cesium.Color.WHITE,
                color:Cesium.Color.BLUE
            }}
        );
    }
}

function getUserLocation(ref){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>showUserLocation(position,ref));
      } else {
        console.log("Geolocation not supported");
      }
}

export function ResiumViewer() {

    const ref = useRef(null);

    useEffect(() => {
        fetchTerrain(ref);
        // fetch_kml(ref, 2496167, null, 2); // design
        // fetch_kml(ref, 2464856, Cesium.Color.BLUE, 2); // asbuilt
        getUserLocation(ref);
        
          

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
            <Entity position={default_compound_position} name="Compound">
                <PointGraphics pixelSize={10} heightReference={Cesium.HeightReference.CLAMP_TO_GROUND} />
                <LabelGraphics
                    text="Compound"
                    verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                    pixelOffset={new Cesium.Cartesian2(0, -9)}
                    font="14pt monospace"
                    style={Cesium.LabelStyle.FILL_AND_OUTLINE}
                    heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                />
            </Entity>
            <CameraFlyTo destination={default_camera_position} />
            <KmlDataSource data={"design_mv_corridor_linework.kml"} clampToGround  onLoad={(kmlDataSouce)=>onLoadCorridorLinework(kmlDataSouce)}/>
            <KmlDataSource data={"design_mv_cable_linework.kml"} clampToGround  onLoad={(kmlDataSouce)=>onLoadCableLinework(kmlDataSouce)}/>
            <KmlDataSource data={"design_mv_cable_labels.kml"} clampToGround onLoad={(kmlDataSouce)=>onLoadCableLabels(kmlDataSouce)}/>
            <KmlDataSource data={"design_mv_jb_labels.kml"} clampToGround onLoad={(kmlDataSouce)=>onLoadJunctionBoxLabels(kmlDataSouce)}/>
            <KmlDataSource data={"turbine_labels.kml"} clampToGround onLoad={(kmlDataSouce)=>onLoadTurbineLabels(kmlDataSouce)}/>
        </Viewer>
    );
}


const onLoadTurbineLabels = async (kmlDataSouce) =>{
    for (const entity of kmlDataSouce.entities.values) {
        if(entity.label){
            entity.label.scaleByDistance = new Cesium.NearFarScalar(1.0e2, 2, 1.0e5, 0.1);
            entity.label.outlineWidth = 4;            
        }
    }

}
const onLoadJunctionBoxLabels = async (kmlDataSouce) =>{
    for (const entity of kmlDataSouce.entities.values) {
        if(entity.label){
            entity.label.scaleByDistance = new Cesium.NearFarScalar(1.0e2, 1.8, 1.0e5, 0.1);
            entity.label.fillColor = Cesium.Color.ORANGE;
            entity.label.outlineWidth = 4;            
        }
    }

}
const onLoadCorridorLinework = async (kmlDataSouce) =>{
    for (const entity of kmlDataSouce.entities.values) {
        if (entity.polyline) {
            entity.polyline.width = 2;
        }
    }
}
const onLoadCableLinework = async (kmlDataSouce) =>{
    for (const entity of kmlDataSouce.entities.values) {
        if (entity.polyline) {
            entity.polyline.width = 3;
        }
    }
}
const onLoadCableLabels = async (kmlDataSouce) =>{
    for (const entity of kmlDataSouce.entities.values) {
        if (entity.polyline) {
            entity.polyline.width = 3;
        }
    }
}
