import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cleanLoadTexture } from "../utils/textureHelper";
import { get2DScreenPosition } from "../utils/positionHelper";
import configs from "../configs";

const SCALE = 1;

export const BOX_WIDTH = 10 * SCALE;
export const MAP_SIZE = 1024; // max: 1280
export const MAP_STYLE = {
  STREET: "mapbox/streets-v11",
  SATELLITE: "mapbox/satellite-v9",
  SATELLITE_STREET: "mapbox/satellite-streets-v11",
};

const getMapBoxImgUrl = (lat, lng, zoom, bearing, mapConfig) => {
  let styles = MAP_STYLE.SATELLITE_STREET;
  let mapBoxToken = configs.mapBoxToken;
  if (mapConfig.mapBoxAccessToken && mapConfig.mapBoxStyle) {
    styles = mapConfig.mapBoxStyle;
    mapBoxToken = mapConfig.mapBoxAccessToken;
  }
  return `https://api.mapbox.com/styles/v1/${styles}/static/${lng},${lat},${zoom},${
    bearing || "0"
  }/${MAP_SIZE}x${MAP_SIZE}@2x?access_token=${mapBoxToken}`;
};

const sidePxUrl = configs.baseUrl + "/assets/images/earth_crust_px.jpg";
const sideNxUrl = configs.baseUrl + "/assets/images/earth_crust_nx.jpg";
const sidePyUrl = configs.baseUrl + "/assets/images/earth_crust_py.jpg";
const sideNyUrl = configs.baseUrl + "/assets/images/earth_crust_ny.jpg";

function Box(props) {
  const { mapConfig, updateCenter } = props;
  const { gl, camera, size } = useThree();
  camera.position.set(0, -10 * SCALE, 9 * SCALE);
  camera.lookAt(0, 0, 0);
  gl.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const {
      center: [lng, lat],
    } = mapConfig;
    const zoom = Math.floor(mapConfig.zoom * 100) / 100;
    cleanLoadTexture(
      getMapBoxImgUrl(lat, lng, zoom, null, mapConfig),
      maxAnisotropy
    ).then((img) => {
      setTexture(img);
    });
  }, [mapConfig, maxAnisotropy]);

  const { width, height } = size;
  useEffect(() => {
    const center = get2DScreenPosition(
      { x: 0, y: 0, z: 0 },
      camera,
      width,
      height
    );
    updateCenter(center);
  }, [width, height, camera, updateCenter]);

  const sideTexture = new THREE.Texture();
  const [pxTexture, setPxTexture] = useState(sideTexture);
  const [nxTexture, setNxTexture] = useState(sideTexture);
  const [pyTexture, setPyTexture] = useState(sideTexture);
  const [nyTexture, setNyTexture] = useState(sideTexture);

  useEffect(() => {
    cleanLoadTexture(sidePxUrl, maxAnisotropy).then((txt) => setPxTexture(txt));
    cleanLoadTexture(sideNxUrl, maxAnisotropy).then((txt) => setNxTexture(txt));
    cleanLoadTexture(sidePyUrl, maxAnisotropy).then((txt) => setPyTexture(txt));
    cleanLoadTexture(sideNyUrl, maxAnisotropy).then((txt) => setNyTexture(txt));
  }, [maxAnisotropy]);

  return (
    <mesh {...props} position={[0, 0, -0.5 * SCALE]} visible={texture !== null}>
      <boxBufferGeometry
        attach="geometry"
        args={[BOX_WIDTH, BOX_WIDTH, 1 * SCALE]}
      />
      <meshStandardMaterial
        attachArray="material"
        color="white"
        map={pxTexture}
        side={THREE.FrontSide}
      />
      {/* px */}
      <meshStandardMaterial
        attachArray="material"
        color="white"
        map={nxTexture}
        side={THREE.FrontSide}
      />
      {/* nx */}
      <meshStandardMaterial
        attachArray="material"
        color="white"
        map={pyTexture}
        side={THREE.FrontSide}
      />
      {/* py */}
      <meshStandardMaterial
        attachArray="material"
        color="white"
        map={nyTexture}
        side={THREE.FrontSide}
      />
      {/* ny */}
      {/* map face */}
      <meshStandardMaterial
        attachArray="material"
        color="white"
        map={texture}
        side={THREE.FrontSide}
      />
      {/* pz */}
      {/* end map face */}
      <meshStandardMaterial attachArray="material" color="white" />
      {/* nz */}
    </mesh>
  );
}

export default Box;
