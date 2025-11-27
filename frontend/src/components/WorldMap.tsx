// src/components/WorldMap.tsx
import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import countries from "../data/countries.geojson"; // GeoJSONをJSONとして取り込む
import co2Data from "../data/co2.json";
import type { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";

interface CO2Data {
  [countryCode: string]: number;
}

// CO2排出量に応じた色を返す関数
const getColor = (value: number) => {
  return value > 10000
    ? "#800026"
    : value > 5000
    ? "#BD0026"
    : value > 1000
    ? "#E31A1C"
    : value > 500
    ? "#FC4E2A"
    : value > 100
    ? "#FD8D3C"
    : "#FEB24C";
};

// GeoJSON各国のスタイル
const style = (feature: any) => {
  const countryCode = feature.properties.ISO_A3 as string;
  const co2 = (co2Data as CO2Data)[countryCode] || 0;
  return {
    fillColor: getColor(co2),
    weight: 1,
    color: "white",
    fillOpacity: 0.7,
  };
};

const WorldMap: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        key="world-map" // HMRなどで再レンダリングされても一枚だけ表示
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={countries as GeoJsonObject} style={style} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
