import * as THREE from 'three';

export const getCameraPositionFromLookAtCoordinates = (x, y, z) => {
  let newX = x,
    newY = y,
    newZ = z;
  while (Math.abs(newX) >= 10 || Math.abs(newY) >= 10 || Math.abs(newZ) >= 10) {
    newX = newX / 2;
    newY = newY / 2;
    newZ = newZ / 2;
  }
  return {
    x: -1 * newX,
    y: -1 * newY,
    z: -1 * newZ,
  };
};

export const getSphericalPosition = function (x, y, w, h) {
  const u = x / w;
  const v = y / h;
  const theta = u * 2 * Math.PI;
  const phi = v * Math.PI;
  return new THREE.Vector3(
    Math.cos(theta) * Math.sin(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(phi)
  );
};

window.getSphericalPosition = getSphericalPosition;

export const updatePositionOfHotspots = (hotspots, camera, width, height) => {
  return hotspots.map((hotspot) => ({
    ...hotspot,
    position: !hotspot.location
      ? {
          visible: false,
          x: -1000,
          y: -1000,
        }
      : get2DScreenPosition(hotspot.location, camera, width, height),
  }));
};

export const get2DScreenPosition = (coord, camera, width, height) => {
  if (!(coord && camera && width && height)) {
    return {
      visible: false,
      x: -1000,
      y: -1000,
    };
  }
  const hpLocation = new THREE.Vector3(coord.x, coord.y, coord.z);
  const vector = hpLocation.project(camera);
  return {
    visible: Math.abs(vector.z) <= 1,
    x: ((vector.x + 1) / 2) * width,
    y: (-(vector.y - 1) / 2) * height,
  };
};

export const distanceBetween2dCoordinates = (
  coord1 = { x: 0, y: 0 },
  coord2 = { x: 0, y: 0 }
) => {
  const xDiff = Math.abs(coord1.x - coord2.x),
    yDiff = Math.abs(coord1.y - coord2.y);
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};
