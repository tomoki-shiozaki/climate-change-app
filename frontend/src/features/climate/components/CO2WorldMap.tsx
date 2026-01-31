import "leaflet/dist/leaflet.css";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions, Layer } from "leaflet";
import { useQuery } from "@tanstack/react-query";
import type { CountryProperties } from "@/types/geo";
import { Loading } from "@/components/common";
import { fetchCO2Data } from "@/features/climate/api/climateApi";
import type { CO2DataByYear } from "@/features/climate/types/climate";
import { useYearAutoPlay } from "@/features/climate/hooks/useYearAutoPlay";
import { Button } from "@/components/ui/button";

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
  // 定数（初期値）
  // ----------------------
  const DEFAULT_MIN_YEAR = 1750;
  const DEFAULT_MAX_YEAR = 2024;

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
  // 年の範囲（CO2 データから派生）
  // ----------------------
  const { minYear, maxYear } = useMemo(() => {
    if (!co2Data) {
      return {
        minYear: DEFAULT_MIN_YEAR,
        maxYear: DEFAULT_MAX_YEAR,
      };
    }

    const years = Object.keys(co2Data).map(Number).filter(Number.isFinite);

    if (!years.length) {
      return {
        minYear: DEFAULT_MIN_YEAR,
        maxYear: DEFAULT_MAX_YEAR,
      };
    }

    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
    };
  }, [co2Data]);

  // ----------------------
  // 年スライダー関連 state
  // ----------------------
  // year:
  //   現在表示している年。
  //   初期値は暫定値で、CO2 データ取得後に最新年へ更新される。
  // isPlaying:
  //   年スライダーの自動再生状態。
  //   true のとき、年が一定間隔で進む。
  const [isPlaying, setIsPlaying] = useState(false);

  const [year, setYear] = useYearAutoPlay({
    initialYear: DEFAULT_MAX_YEAR,
    maxYear,
    isPlaying,
  });

  // ----------------------
  // CO2 データ取得後：表示年を最新年に合わせる
  // ----------------------
  useEffect(() => {
    if (!co2Data) return;
    setYear(maxYear);
  }, [co2Data, maxYear, setYear]);

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
    feature?: Feature<Geometry, CountryProperties>,
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
    layer: Layer,
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
          : `${name}: ${value.toLocaleString()} トン`,
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
    <div className="relative w-full h-[90vh]">
      {/* 年スライダー */}
      <div className="absolute bottom-16 left-1/2 z-[1000] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "停止" : "再生"}
        </Button>

        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-80"
        />

        <span className="font-semibold">{year}</span>
      </div>

      {/* 地図 */}
      <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
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
