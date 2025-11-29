import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type {
  CountryFeatureCollection,
  CO2DataByYear,
  CountryProperties,
} from "../types/geo";
import type { PathOptions } from "leaflet";

// 静的国境データ（GeoJSON）
import countries from "../data/ne_50m_admin_0_countries.json";

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

  const [year, setYear] = useState(2020);
  const [co2Data, setCo2Data] = useState<CO2DataByYear>({});

  // API から CO2 データ取得
  useEffect(() => {
    fetch("/api/co2-data/") // DRF 側のエンドポイント
      .then((res) => res.json())
      .then((data) => setCo2Data(data.data)) // Serializer の data フィールド
      .catch((err) => console.error("CO2データ取得エラー:", err));
  }, []);

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
      {/* 年スライダーを下部中央に配置 */}
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
        <GeoJSON data={geoData} style={style} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
