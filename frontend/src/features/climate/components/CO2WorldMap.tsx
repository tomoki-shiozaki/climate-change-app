import "leaflet/dist/leaflet.css";
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions, Layer } from "leaflet";
import { useQuery } from "@tanstack/react-query";
import type { CountryProperties } from "@/types/geo";
import { Loading } from "@/components/common";
import { fetchCO2Data } from "@/features/climate/api/climateApi";
import type { CO2DataByYear } from "@/features/climate/types/climate";

// 静的国境データ（Natural Earth）
import { geoData } from "@/features/climate/data/geoData";

import {
  getCountryInfo,
  getFillColor,
} from "@/features/climate/utils/mapUtils";

/* =====================================================
 * WorldMap Component
 * ===================================================== */

export const CO2WorldMap: React.FC = () => {
  // ----------------------
  // 年スライダーの状態
  // ----------------------
  // year: 現在表示している年（初期値は暫定 2024、データ取得後に最新年に更新される）
  // minYear: スライダーの最小年（暫定 1750、データ取得後に更新される可能性あり）
  // maxYear: スライダーの最大年（暫定 2024、データ取得後に更新される）
  // isPlaying: 自動再生の状態（true のときスライダーが自動で進む）
  const [year, setYear] = useState(2024);
  const [minYear, setMinYear] = useState(1750);
  const [maxYear, setMaxYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  // ----------------------
  // CO2 データ取得
  // ----------------------
  const {
    data: co2Data,
    isLoading,
    isError,
  } = useQuery<CO2DataByYear>({
    queryKey: ["co2Data"],
    queryFn: fetchCO2Data,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30日
  });

  // ----------------------
  // CO2 データ取得後に年範囲を更新
  // ----------------------
  useEffect(() => {
    if (!co2Data) return;

    // データに含まれる年の一覧を取得
    const years = Object.keys(co2Data).map(Number).filter(Number.isFinite);
    if (!years.length) return;

    const min = Math.min(...years);
    const max = Math.max(...years);

    setMinYear(min); // スライダーの最小年を設定
    setMaxYear(max); // スライダーの最大年を設定

    // 初期年を最新年に設定
    setYear(max);
  }, [co2Data]);

  // ----------------------
  // 自動再生（年送り）
  // ----------------------
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setYear((prev) => {
        if (prev >= maxYear) {
          clearInterval(interval); // 最後まで来たら停止
          return maxYear;
        }
        return prev + 1;
      });
    }, 500); // 500ms ごとに1年進める

    return () => clearInterval(interval);
  }, [isPlaying, maxYear]);

  // ----------------------
  // GeoJSON レイヤーの ref
  // ----------------------
  const geoJsonRef = useRef<L.GeoJSON<
    Feature<Geometry, CountryProperties>
  > | null>(null);

  // ----------------------
  // 各国ポリゴンのスタイル指定
  // ----------------------
  const style = (
    feature?: Feature<Geometry, CountryProperties>
  ): PathOptions => {
    // feature が未定義の場合は空（描画エラー防止）
    if (!feature) return {};

    // 国情報（CO2値のみ使用）
    const { value } = getCountryInfo(feature, year, co2Data);

    return {
      fillColor: getFillColor(value),
      weight: 1, // ポリゴン境界線の太さ
      color: "white", // 境界線の色
      fillOpacity: 0.7, // 塗りつぶしの透明度
    };
  };

  // ----------------------
  // 初回描画時：ツールチップ設定
  // ----------------------
  const onEachFeature = (
    feature: Feature<Geometry, CountryProperties>,
    layer: Layer
  ) => {
    const { value, name } = getCountryInfo(feature, year, co2Data);

    // ツールチップに表示する文字列を作成
    // データがない場合は「データなし」と表示
    // データがある場合は数値をカンマ区切りにして「トン」で表示
    const tooltipText =
      value === undefined
        ? `${name}: データなし`
        : `${name}: ${value.toLocaleString()} トン`;

    // マウス追従型ツールチップ
    // { sticky: true } はマウスをポリゴン上に置いたときにツールチップが追従する
    layer.bindTooltip(tooltipText, { sticky: true });
  };

  // ----------------------
  // year / co2Data 変更時：色とツールチップ更新
  // ----------------------
  useEffect(() => {
    if (!geoJsonRef.current || !co2Data) return;

    geoJsonRef.current.eachLayer((layer) => {
      // Leaflet の Path かつ feature を持つと仮定して型付け
      const pathLayer = layer as L.Path & {
        feature?: Feature<Geometry, CountryProperties>;
      };

      const feature = pathLayer.feature;
      if (!feature) return;

      const { value, name } = getCountryInfo(feature, year, co2Data);

      // スタイル更新
      pathLayer.setStyle({
        fillColor: getFillColor(value),
        fillOpacity: 0.7,
        weight: 1,
        color: "white",
      });

      // ツールチップ更新
      pathLayer.setTooltipContent(
        value === undefined
          ? `${name}: データなし`
          : `${name}: ${value.toLocaleString()} トン`
      );
    });
  }, [year, co2Data]);

  // ----------------------
  // 状態別レンダリング
  // ----------------------
  if (isLoading) return <Loading />;
  if (isError) return <p>CO2データの取得に失敗しました</p>;
  if (!co2Data) return <p>データがありません</p>;

  // ----------------------
  // 描画
  // ----------------------
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
          style={{ width: 400 }}
        />
        <span style={{ fontWeight: "bold" }}>{year}</span>
      </div>

      {/* 地図 */}
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
