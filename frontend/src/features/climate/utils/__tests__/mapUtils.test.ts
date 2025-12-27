import {
  getCountryInfo,
  getFillColor,
} from "@/features/climate/utils/mapUtils";
import type { Feature, Geometry } from "geojson";
import type { CountryProperties } from "@/types/geo";

describe("getCountryInfo", () => {
  const featureMock = (
    props: Partial<CountryProperties>
  ): Feature<Geometry, CountryProperties> => ({
    type: "Feature",
    properties: {
      ISO_A3_EH: "",
      NAME_JA: "",
      ADMIN: "",
      ...props,
    } as CountryProperties,
    geometry: { type: "Point", coordinates: [0, 0] },
  });

  const co2DataMock = {
    2024: {
      JPN: 1_200_000_000,
      USA: 5_500_000_000,
    },
  };

  it("日本語名がある場合はNAME_JAを返す", () => {
    const feature = featureMock({ ISO_A3_EH: "JPN", NAME_JA: "日本" });
    const { name, value } = getCountryInfo(feature, 2024, co2DataMock);
    expect(name).toBe("日本");
    expect(value).toBe(1_200_000_000);
  });

  it("日本語名がなく英語名がある場合はADMINを返す", () => {
    const feature = featureMock({ ISO_A3_EH: "USA", ADMIN: "United States" });
    const { name, value } = getCountryInfo(feature, 2024, co2DataMock);
    expect(name).toBe("United States");
    expect(value).toBe(5_500_000_000);
  });

  it("国コードがない場合はvalueがundefinedになる", () => {
    const feature = featureMock({ NAME_JA: "無国" });
    const { name, value } = getCountryInfo(feature, 2024, co2DataMock);
    expect(name).toBe("無国");
    expect(value).toBeUndefined();
  });

  it("NAME_JAもADMINもない場合は'不明'を返す", () => {
    const feature = featureMock({ ISO_A3_EH: "XXX" });
    const { name, value } = getCountryInfo(feature, 2024, co2DataMock);
    expect(name).toBe("不明");
    expect(value).toBeUndefined();
  });
});

describe("getFillColor", () => {
  it("undefinedの場合は灰色", () => {
    expect(getFillColor(undefined)).toBe("#d3d3d3");
  });

  it("数値がある場合はgetCO2Colorに従った色になる", () => {
    expect(getFillColor(15_000_000_000)).toBe("#800026");
    expect(getFillColor(6_000_000_000)).toBe("#BD0026");
    expect(getFillColor(2_000_000_000)).toBe("#E31A1C");
    expect(getFillColor(700_000_000)).toBe("#FC4E2A");
    expect(getFillColor(200_000_000)).toBe("#FD8D3C");
    expect(getFillColor(50_000_000)).toBe("#FEB24C");
  });
});
