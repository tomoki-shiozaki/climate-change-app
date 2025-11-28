// GeoJSON の各国 Feature の必要最低限のプロパティ
export interface CountryProperties {
  ISO_A3: string; // 国コード
  NAME: string; // 国名
}

// Polygon と MultiPolygon の座標型
export type PolygonCoordinates = number[][][]; // 3次元配列
export type MultiPolygonCoordinates = number[][][][]; // 4次元配列

// Feature（Polygon / MultiPolygon に対応）
export interface CountryFeature {
  type: "Feature";
  properties: CountryProperties;
  geometry:
    | {
        type: "Polygon";
        coordinates: PolygonCoordinates;
      }
    | {
        type: "MultiPolygon";
        coordinates: MultiPolygonCoordinates;
      };
}

// FeatureCollection 全体
export interface CountryFeatureCollection {
  type: "FeatureCollection";
  features: CountryFeature[];
}

// CO2 データの型
export interface CO2Data {
  [countryCode: string]: number;
}
