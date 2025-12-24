// ---- GeoJSON 基本型 ----

// 経度・緯度（高度は省略）
export type Position = [number, number];

// Polygon: 輪（外輪 + 内輪）= Position の配列の配列
export type PolygonCoordinates = Position[][];

// MultiPolygon: Polygon の配列
export type MultiPolygonCoordinates = Position[][][];

// ---- 国プロパティ ----
export interface CountryProperties {
  ISO_A3_EH: string; // 拡張版 ISO_A3. 正式な ISO A3 コードとして使用
  NAME: string;
  [key: string]: unknown; // その他のプロパティ
}

// ---- Feature ----
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

// ---- FeatureCollection ----
export interface CountryFeatureCollection {
  type: "FeatureCollection";
  features: CountryFeature[];
}

// ---- CO2 データ ----
// 年ごとの CO2 排出量に対応
export interface CO2DataByYear {
  [year: number]: {
    [isoA3: string]: number;
  };
}
