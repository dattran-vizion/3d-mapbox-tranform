import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import Box from "./box";

class TheedMap extends React.Component {
  state = {
    angleZ: -45,
    mapRotate: 0,
    lightSettings: {
      intensity: 1.5,
      color: new THREE.Color("white"),
    },
  };
  center = {
    x: 0,
    y: 0,
  };
  oldCoord = {
    x: 0,
    y: 0,
  };

  componentDidMount() {
    if (this.props.mapConfig) {
      this.applyMapConfig(this.props.mapConfig);
    }
  }

  applyMapConfig(mapConfig) {
    const lightSettings = { ...this.state.lightSettings };
    if (mapConfig.light) {
      if (typeof mapConfig.light.intensity === "number") {
        lightSettings.intensity += mapConfig.light.intensity;
      }
      if (typeof mapConfig.light.color === "string") {
        lightSettings.color.set(mapConfig.light.color);
      }
    }
    this.setState({ lightSettings });
  }

  setCenter = ({ x, y, visible }) => {
    this.center = { x, y, visible };
  };

  render() {
    const { mapConfig } = this.props;
    return (
      <Canvas camera={{ fov: 50 }}>
        <axesHelper args={[5, 5, 5]} />
        <ambientLight intensity={2} color={{ r: 1, g: 1, b: 1 }} />
        <directionalLight intensity={0.2} position={[0, 0, 10]} />
        <Suspense fallback={null}>
          <Box mapConfig={mapConfig} updateCenter={this.setCenter} />
        </Suspense>
      </Canvas>
    );
  }
}

export default TheedMap;
