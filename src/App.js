import React from "react";
import configs from "./configs";
import Map, { Marker } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import {PATH_POINTS} from "./components/MockData/pathPoints";

const TOKEN = configs.mapBoxToken;

const INITIAL_VIEW_STATE = {
  longitude: 106.6607974,
  latitude: 10.8011641,
  zoom: 14.5,
  pitch: 0,
  bearing: 0,
};

const PATH_DATA = [
  {
    path: PATH_POINTS,
    color: [255, 0, 0],
  },
];

function App() {
  function handleClick(event) {
    const lngLat = event.coordinate;
    console.log("lngLat: ", lngLat);
  }

  const pathOptions = {
    data: PATH_DATA,
    getWidth: 2,
    widthMinPixels: 2,
    getColor: (d) => d.color,
  };

  const layers = [new PathLayer(pathOptions)];

  return (
    <div className="map-container">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        onClick={handleClick}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={TOKEN}
          onClick={handleClick}
        >
          <Marker
            longitude={106.66354929544875}
            latitude={10.81240406267263}
            anchor="bottom"
          >
            <img
              src="images/mapbox-icon.png"
              style={{ width: "40px", height: "40px" }}
            />
          </Marker>
          <Marker longitude={106.6521184} latitude={10.800626} anchor="bottom">
            <img
              src="images/mapbox-icon.png"
              style={{ width: "40px", height: "40px" }}
            />
          </Marker>
        </Map>
      </DeckGL>
    </div>
  );
}

export default App;
