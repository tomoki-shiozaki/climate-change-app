import type { paths } from "../api";

// ClimateData型をわかりやすくエクスポート
export type TemperatureData =
  paths["/api/v1/temperature/"]["get"]["responses"]["200"]["content"]["application/json"][number];
