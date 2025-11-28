import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type {
  CountryFeatureCollection,
  CO2DataByYear,
  CountryProperties,
} from "../types/geo";
import countries from "../data/ne_50m_admin_0_countries.json";
import co2DataJson from "../data/co2.json";
import type { PathOptions } from "leaflet";

const getColor = (value: number) =>
  value > 10000
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

const WorldMap: React.FC = () => {
  const geoData = countries as unknown as CountryFeatureCollection;
  const co2Data = co2DataJson as CO2DataByYear;

  const [year, setYear] = useState(2020);

  // ここを正しく型定義
  const style = (
    feature: Feature<Geometry, CountryProperties> | undefined
  ): PathOptions => {
    if (!feature) return {};

    const code = feature.properties?.ISO_A3;
    const value = co2Data[year]?.[code] ?? 0;

    return {
      fillColor: getColor(value),
      weight: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* スライダーを下部中央に配置 */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <input
          type="range"
          min={2020}
          max={2022}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: 200 }}
        />
        <span style={{ marginLeft: 10, fontWeight: "bold" }}>{year}</span>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* ✨ 完全に型安全 */}
        <GeoJSON data={geoData} style={style} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
