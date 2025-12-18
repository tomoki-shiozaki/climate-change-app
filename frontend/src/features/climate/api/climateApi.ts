import { apiClient } from "@/features/auth/api/apiClient";
import { TEMPERATURE_ENDPOINT } from "@/features/climate/api/constants";
import type { TemperatureData } from "@/features/climate/types/climate";

export async function fetchTemperatureData(): Promise<TemperatureData> {
  const res = await apiClient.get<TemperatureData>(TEMPERATURE_ENDPOINT);
  return res.data;
}
