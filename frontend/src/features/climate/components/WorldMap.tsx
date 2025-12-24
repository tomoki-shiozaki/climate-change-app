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

// 静的国境データ（GeoJSON）
// geoData.ts で Natural Earth の Admin 0 – Countries をエクスポート
import { geoData } from "@/features/climate/data/geoData";
// CO2値に応じた色を返す関数
import { getCO2Color } from "@/features/climate/utils/color";

const WorldMap: React.FC = () => {
  // 年スライダーの状態
  // year: 現在表示している年（初期値は暫定 2024、データ取得後に最新年に更新される）
  // minYear: スライダーの最小年（暫定 1750、データ取得後に更新される可能性あり）
  // maxYear: スライダーの最大年（暫定 2024、データ取得後に更新される）
  // isPlaying: 自動再生の状態（true のときスライダーが自動で進む）
  const [year, setYear] = useState(2024);
  const [minYear, setMinYear] = useState(1750);
  const [maxYear, setMaxYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  // CO2データ取得
  const {
    data: co2Data,
    isLoading,
    isError,
  } = useQuery<CO2DataByYear>({
    queryKey: ["co2Data"],
    queryFn: fetchCO2Data,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30日
  });

  // CO2データ取得後に minYear / maxYear / year を更新
  // 初期値は暫定的な設定（1750 / 2024）
  useEffect(() => {
    if (!co2Data) return;

    // データに存在する年の配列を取得
    const years = Object.keys(co2Data).map(Number).filter(Number.isFinite);

    if (!years.length) return;

    const min = Math.min(...years);
    const max = Math.max(...years);

    setMinYear(min); // スライダーの最小年を設定
    setMaxYear(max); // スライダーの最大年を設定

    // 初期年を最新年に設定
    setYear(max);
  }, [co2Data]);

  // 自動再生
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

  // GeoJSONレイヤーのref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoJsonRef = useRef<L.GeoJSON<any>>(null);

  // 各国ポリゴンのスタイルを決める関数
  // GeoJSON の feature を受け取り、PathOptions を返す
  const style = (
    feature?: Feature<Geometry, CountryProperties> // ? を付けて feature が undefined でも安全に処理
  ): PathOptions => {
    if (!feature) return {}; // feature が存在しなければ空オブジェクトを返す（描画時エラー回避）

    // 国コード（ISO_A3_EH）を取得
    const code = feature.properties?.ISO_A3_EH;

    // その年・その国の CO2 排出量を取得
    const value = co2Data?.[year]?.[code];

    return {
      // データがない国は薄いグレー、それ以外は CO2 値に応じた色
      fillColor: value === undefined ? "#d3d3d3" : getCO2Color(value),
      weight: 1, // ポリゴン境界線の太さ
      color: "white", // 境界線の色
      fillOpacity: 0.7, // 塗りつぶしの透明度
    };
  };

  // GeoJSON の各国ポリゴンにツールチップを設定する関数（初回）
  const onEachFeature = (
    feature: Feature<Geometry, CountryProperties>, // GeoJSON の各 feature（国ポリゴンとそのプロパティ）
    layer: Layer // Leaflet 上で描画されたその国ポリゴンのレイヤー
  ) => {
    // 国コード（ISO_A3_EH）を取得。CO2 データ取得のキーとして使用
    const code = feature.properties?.ISO_A3_EH;

    // その国・その年の CO2 排出量を取得
    const value = co2Data?.[year]?.[code];

    // ツールチップに表示する国名を決定
    // 日本語名(NAME_JA)があればそれを使用、なければ英語名(ADMIN)、それもなければ "不明"
    const countryName =
      feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

    // ツールチップに表示する文字列を作成
    // データがない場合は「データなし」と表示
    // データがある場合は数値をカンマ区切りにして「トン」で表示
    const tooltipText =
      value === undefined
        ? `${countryName}: データなし`
        : `${countryName}: ${value.toLocaleString()} トン`;

    // 作成したツールチップをレイヤーに紐付け
    // { sticky: true } はマウスをポリゴン上に置いたときにツールチップが追従する
    layer.bindTooltip(tooltipText, { sticky: true });
  };

  // year または co2Data が変わったら、色とツールチップを更新
  useEffect(() => {
    if (!geoJsonRef.current || !co2Data) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geoJsonRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      if (!feature) return;

      const code = feature.properties?.ISO_A3_EH; // <- EH を使用
      const value = co2Data[year]?.[code]; // undefined のままにする
      const countryName =
        feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

      // 色を更新
      layer.setStyle({
        fillColor: value === undefined ? "#d3d3d3" : getCO2Color(value),
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
  if (isError) return <p>CO2データの取得に失敗しました</p>;
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
