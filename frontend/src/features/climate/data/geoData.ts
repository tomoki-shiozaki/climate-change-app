// 静的国境データ（GeoJSON）
// Natural Earth の Admin 0 – Countries を使用
// ISO_A3 について：
// - 元の ISO_A3 は一部の国（例：フランスの海外領土など）で "-99" になっている。
// - そのため、最初から ISO_A3_EH を ISO_A3 として扱うことにする。
// - CO2 データなど ISO_A3 をキーとした結合が安全に行える。

import countriesJson from "@/data/ne_50m_admin_0_countries.json";
import type { CountryFeatureCollection } from "@/types/geo";

export const geoData: CountryFeatureCollection =
  countriesJson as CountryFeatureCollection;

// WorldMap 側では geoData.features[i].properties.ISO_A3_EH を ISO_A3 として使用
