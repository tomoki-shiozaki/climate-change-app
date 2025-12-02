import "leaflet/dist/leaflet.css";
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions, Layer } from "leaflet";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type {
  CountryFeatureCollection,
  CO2DataByYear,
  CountryProperties,
} from "../types/geo";
import { Loading } from "@/components/common";

// 静的国境データ（GeoJSON）
import countries from "../data/ne_50m_admin_0_countries.json";

// GeoJSONを前処理して ISO_A3 が "-99" の場合に ISO_A3_EH で置き換え
const geoData: CountryFeatureCollection = {
  ...(countries as unknown as CountryFeatureCollection),
  features: (countries as unknown as CountryFeatureCollection).features.map(
    (feature) => {
      if (
        feature.properties?.ISO_A3 === "-99" &&
        feature.properties?.ISO_A3_EH
      ) {
        // unknown を string にキャスト
        feature.properties.ISO_A3 = feature.properties.ISO_A3_EH as string;
      }
      return feature;
    }
  ),
};

// CO2値に応じた色を返す関数
const getColor = (value: number) =>
  value > 10000000000 // 100億トン以上（中国クラス）
    ? "#800026"
    : value > 5000000000 // 50億トン以上（アメリカクラス）
    ? "#BD0026"
    : value > 1000000000 // 10億トン以上
    ? "#E31A1C"
    : value > 500000000 // 5億トン以上
    ? "#FC4E2A"
    : value > 100000000 // 1億トン以上
    ? "#FD8D3C"
    : "#FEB24C"; // それ以下

// CO2データ取得関数
const fetchCO2Data = async (): Promise<CO2DataByYear> => {
  const response = await apiClient.get("/co2-data/"); // DRF エンドポイント
  return response.data.co2_data; // Serializer の co2_data フィールド
};

const WorldMap: React.FC = () => {
  const [year, setYear] = useState(2020);
  const [minYear, setMinYear] = useState(2020);
  const [maxYear, setMaxYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false); // 自動再生状態

  // CO2データ取得
  const {
    data: co2Data = {},
    isLoading,
    error,
  } = useQuery<CO2DataByYear>({
    queryKey: ["co2Data"],
    queryFn: fetchCO2Data,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });

  // CO2データが取得できたら minYear / maxYear を更新
  useEffect(() => {
    if (!co2Data) return;

    const years = Object.keys(co2Data)
      .map((y) => parseInt(y))
      .filter((y) => !isNaN(y));

    if (years.length === 0) return;

    setMinYear(Math.min(...years));
    setMaxYear(Math.max(...years));

    // 初期年を最新年に設定
    setYear(Math.max(...years));
  }, [co2Data]);

  // 自動再生用の useEffect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setYear((prevYear) => {
        if (prevYear >= maxYear) {
          clearInterval(interval); // 最後まで来たら停止
          return maxYear;
        }
        return prevYear + 1;
      });
    }, 500); // 500ms ごとに1年進める

    return () => clearInterval(interval); // クリーンアップ
  }, [isPlaying, maxYear]);

  // GeoJSONレイヤーのref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoJsonRef = useRef<L.GeoJSON<any>>(null);

  // ポリゴンのスタイル
  const style = (
    feature: Feature<Geometry, CountryProperties> | undefined
  ): PathOptions => {
    if (!feature) return {};
    const code = feature.properties?.ISO_A3;
    const value = co2Data[year]?.[code];

    return {
      fillColor: value === undefined ? "#d3d3d3" : getColor(value), // データなしは薄いグレー
      weight: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // 初回ツールチップ設定
  const onEachFeature = (
    feature: Feature<Geometry, CountryProperties>,
    layer: Layer
  ) => {
    const code = feature.properties?.ISO_A3;
    const value = co2Data[year]?.[code];
    const countryName =
      feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

    const tooltipText =
      value === undefined
        ? `${countryName}: データなし`
        : `${countryName}: ${value.toLocaleString()} CO2`;

    layer.bindTooltip(tooltipText, { sticky: true });
  };

  // year または co2Data が変わったら、色とツールチップを更新
  useEffect(() => {
    if (!geoJsonRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geoJsonRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      if (!feature) return;

      const code = feature.properties?.ISO_A3;
      const value = co2Data[year]?.[code]; // undefined のままにする
      const countryName =
        feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

      // 色を更新
      layer.setStyle({
        fillColor: value === undefined ? "#d3d3d3" : getColor(value),
        fillOpacity: 0.7,
        weight: 1,
        color: "white",
      });

      // ツールチップ内容を更新
      layer.setTooltipContent(
        value === undefined
          ? `${countryName}: データなし`
          : `${countryName}: ${value.toLocaleString()} CO2`
      );
    });
  }, [year, co2Data]);

  if (isLoading) return <Loading />;
  if (error) return <p>CO2データの取得に失敗しました</p>;
  if (!co2Data) return <p>データがありません</p>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* 年スライダーを下部中央に配置 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "停止" : "再生"}
        </button>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: 400 }} // スライダー長め
        />
        <span style={{ fontWeight: "bold" }}>{year}</span>
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
          ref={geoJsonRef}
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
