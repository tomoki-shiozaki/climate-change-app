import type { paths } from "../api";

// ClimateData型をわかりやすくエクスポート
export type ClimateData =
  paths["/api/v1/climate-data/"]["get"]["responses"]["200"]["content"]["application/json"][number];

// 1件分のレコード型（retrieve用）
export type ClimateDataDetail =
  paths["/api/v1/climate-data/{id}/"]["get"]["responses"]["200"]["content"]["application/json"];
