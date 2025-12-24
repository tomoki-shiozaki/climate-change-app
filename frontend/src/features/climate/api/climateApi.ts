import { apiClient } from "@/features/auth/api/apiClient";
import {
  TEMPERATURE_ENDPOINT,
  CO2_ENDPOINT,
} from "@/features/climate/api/constants";
import type {
  TemperatureData,
  CO2DataByYear,
} from "@/features/climate/types/climate";

/**
 * 温度データを取得する関数
 */
export async function fetchTemperatureData(): Promise<TemperatureData> {
  const res = await apiClient.get<TemperatureData>(TEMPERATURE_ENDPOINT);
  return res.data;
}

/**
 * CO2データを取得する関数
 */
export async function fetchCO2Data(): Promise<CO2DataByYear> {
  const res = await apiClient.get(CO2_ENDPOINT);
  // Serializer の co2_data フィールドを返す
  return res.data.co2_data;
}
