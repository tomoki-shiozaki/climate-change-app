import type { Feature, Geometry } from "geojson";
import type { CountryProperties } from "@/types/geo";
import type { CO2DataByYear } from "@/features/climate/types/climate";
import { getCO2Color } from "@/features/climate/utils/color";

/**
 * GeoJSON Feature から「国名」と「指定年の CO2 排出量」を取得
 */
// - GeoJSON (RFC 7946) では properties が null になり得るため optional chaining を使用
// - 国名は 日本語名(NAME_JA) → 英語名(ADMIN) → "不明" の優先順で決定
// - CO2 データが存在しない場合、value は undefined になる
export const getCountryInfo = (
  feature: Feature<Geometry, CountryProperties>,
  year: number,
  co2Data?: CO2DataByYear
) => {
  // CO2 データ取得に使う国コード
  const code = feature.properties?.ISO_A3_EH;

  // CO2 排出量（存在しない場合は undefined）
  const value = code ? co2Data?.[year]?.[code] : undefined;

  // 表示用国名（日本語 → 英語 → 不明）
  const name =
    feature.properties?.NAME_JA || feature.properties?.ADMIN || "不明";

  return { value, name };
};

/**
 * CO2 値から塗り色を決定（データなしはグレー）
 */
export const getFillColor = (value?: number) =>
  value === undefined ? "#d3d3d3" : getCO2Color(value);
