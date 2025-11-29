import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions } from "leaflet";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type {
  CountryFeatureCollection,
  CO2DataByYear,
  CountryProperties,
} from "../types/geo";

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

const fetchCO2Data = async (): Promise<CO2DataByYear> => {
  const response = await apiClient.get("/co2-data/"); // DRF エンドポイント
  return response.data.data; // Serializer の data フィールド
};

const WorldMap: React.FC = () => {
  const geoData = countries as unknown as CountryFeatureCollection;
  const [year, setYear] = useState(2020);

  // TanStack Query で CO2 データ取得
  const {
    data: co2Data = {},
    isLoading,
    error,
  } = useQuery<CO2DataByYear>({
    queryKey: ["co2Data"],
    queryFn: fetchCO2Data,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });

  // ポリゴンのスタイル
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

  // ツールチップ設定

  const onEachFeature = (
    feature: Feature<Geometry, CountryProperties>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layer: any
  ) => {
    const code = feature.properties?.ISO_A3;
    const value = co2Data[year]?.[code] ?? 0;
    const countryName =
      feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

    layer.bindTooltip(`${countryName}: ${value.toLocaleString()} CO2`, {
      sticky: true, // マウスに追従
    });
  };

  if (isLoading) return <div>CO2データを読み込み中...</div>;
  if (error) return <div>CO2データの取得に失敗しました</div>;

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
        <GeoJSON
          key={year} // ← ここで再レンダリング
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
