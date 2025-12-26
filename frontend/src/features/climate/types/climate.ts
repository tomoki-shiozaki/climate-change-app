import type { paths } from "@/types/api";

// ClimateData型をわかりやすくエクスポート
export type TemperatureData =
  paths["/api/v1/climate/temperature/"]["get"]["responses"]["200"]["content"]["application/json"];

// ---- CO2 データ ----
// 年ごとの CO2 排出量に対応
export interface CO2DataByYear {
  [year: number]: {
    [isoA3: string]: number;
  };
}
