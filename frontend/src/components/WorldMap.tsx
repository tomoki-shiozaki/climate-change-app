import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { CountryFeatureCollection, CO2Data } from "../types/geo";
import countries from "../data/ne_50m_admin_0_countries.json";
import co2Data from "../data/co2.json";

// CO2に応じた色
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

// 各国のスタイル
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const geoData = countries as unknown as CountryFeatureCollection;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={geoData} style={style} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
