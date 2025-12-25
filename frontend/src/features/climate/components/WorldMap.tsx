import "leaflet/dist/leaflet.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions, Layer } from "leaflet";
import { useQuery } from "@tanstack/react-query";
import type { CountryProperties } from "@/types/geo";
import { Loading } from "@/components/common";
import { fetchCO2Data } from "@/features/climate/api/climateApi";
import type { CO2DataByYear } from "@/features/climate/types/climate";
import { geoData } from "@/features/climate/data/geoData";
import { getCO2Color } from "@/features/climate/utils/color";

// ----------------------
// useInterval Hook
// ----------------------
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// ----------------------
// YearControl Component
// ----------------------
interface YearControlProps {
  year: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  onChangeYear: (y: number) => void;
  onTogglePlay: () => void;
}

const YearControl: React.FC<YearControlProps> = ({
  year,
  minYear,
  maxYear,
  isPlaying,
  onChangeYear,
  onTogglePlay,
}) => (
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
    <button onClick={onTogglePlay}>{isPlaying ? "停止" : "再生"}</button>
    <input
      type="range"
      min={minYear}
      max={maxYear}
      value={year}
      onChange={(e) => onChangeYear(Number(e.target.value))}
      style={{ width: 400 }}
    />
    <span style={{ fontWeight: "bold" }}>{year}</span>
  </div>
);

// ----------------------
// Helper Functions
// ----------------------
// GeoJSON (RFC 7946) の Feature では properties が null になり得るため optional chaining を使用
// ツールチップに表示する国名を決定
// 日本語名(NAME_JA)があればそれを使用し、なければ英語名(ADMIN)、
// それも存在しない場合は "不明" を表示する
const getCountryName = (feature: Feature<Geometry, CountryProperties>) =>
  feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

// GeoJSON Feature から国コード（ISO_A3_EH）を取得し、
// 指定した年の CO2 排出量を返す。
// 国コードが取得できない場合は undefined を返す。
const getCountryValue = (
  feature: Feature<Geometry, CountryProperties>,
  year: number,
  co2Data?: CO2DataByYear
) => {
  const code = feature.properties?.ISO_A3_EH;
  return code ? co2Data?.[year]?.[code] : undefined;
};

// 指定した年と CO2 データをもとに、
// GeoJSON Feature 用のスタイル関数を生成する
const getCountryStyle =
  (year: number, co2Data?: CO2DataByYear) =>
  (feature?: Feature<Geometry, CountryProperties>): PathOptions => {
    if (!feature) return {};
    const value = getCountryValue(feature, year, co2Data);
    return {
      // データがない国は薄いグレー、それ以外は CO2 値に応じた色
      fillColor: value === undefined ? "#d3d3d3" : getCO2Color(value),
      weight: 1, // ポリゴン境界線の太さ
      color: "white", // 境界線の色
      fillOpacity: 0.7, // 塗りつぶしの透明度
    };
  };

const updateLayerStyleAndTooltip = (
  layer: L.Path & { feature?: Feature<Geometry, CountryProperties> },
  year: number,
  co2Data: CO2DataByYear
) => {
  const feature = layer.feature;
  if (!feature) return;

  const value = getCountryValue(feature, year, co2Data);
  const countryName = getCountryName(feature);

  layer.setStyle({
    fillColor: value === undefined ? "#d3d3d3" : getCO2Color(value),
    fillOpacity: 0.7,
    weight: 1,
    color: "white",
  });

  layer.setTooltipContent(
    value === undefined
      ? `${countryName}: データなし`
      : `${countryName}: ${value.toLocaleString()} トン`
  );
};

// ----------------------
// WorldMap Component
// ----------------------
const WorldMap: React.FC = () => {
  const [year, setYear] = useState(2024);
  const [minYear, setMinYear] = useState(1750);
  const [maxYear, setMaxYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    data: co2Data,
    isLoading,
    isError,
  } = useQuery<CO2DataByYear>({
    queryKey: ["co2Data"],
    queryFn: fetchCO2Data,
    staleTime: 1000 * 60 * 60 * 24 * 30,
  });

  const geoJsonRef = useRef<L.GeoJSON<
    Feature<Geometry, CountryProperties>
  > | null>(null);

  // データ取得後にスライダー範囲を更新
  useEffect(() => {
    if (!co2Data) return;
    const years = Object.keys(co2Data).map(Number).filter(Number.isFinite);
    if (!years.length) return;
    setMinYear(Math.min(...years));
    setMaxYear(Math.max(...years));
    setYear(Math.max(...years));
  }, [co2Data]);

  // 自動再生
  useInterval(
    () => {
      setYear((prev) => (prev >= maxYear ? maxYear : prev + 1));
    },
    isPlaying ? 500 : null
  );

  // GeoJSON のスタイル・ツールチップ更新
  useEffect(() => {
    if (!geoJsonRef.current || !co2Data) return;
    geoJsonRef.current.eachLayer((layer) => {
      const pathLayer = layer as L.Path & {
        feature?: Feature<Geometry, CountryProperties>;
      };
      updateLayerStyleAndTooltip(pathLayer, year, co2Data);
    });
  }, [year, co2Data]);

  const onEachFeature = useCallback(
    (_feature: Feature<Geometry, CountryProperties>, layer: Layer) => {
      const pathLayer = layer as L.Path & {
        feature?: Feature<Geometry, CountryProperties>;
      };
      updateLayerStyleAndTooltip(pathLayer, year, co2Data!);
    },
    [year, co2Data]
  );

  if (isLoading) return <Loading />;
  if (isError) return <p>CO2データの取得に失敗しました</p>;
  if (!co2Data) return <p>データがありません</p>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <YearControl
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        isPlaying={isPlaying}
        onChangeYear={setYear}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
      />

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
          style={getCountryStyle(year, co2Data)}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
