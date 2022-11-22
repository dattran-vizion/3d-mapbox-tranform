import React from "react";
import TheedMap from "./threedMap";
import { mapConfig } from "./mockData/constant";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <TheedMap mapConfig={mapConfig} />
    </div>
  );
}
