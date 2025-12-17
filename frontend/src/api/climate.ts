import { apiClient } from "@/features/auth/api/apiClient";
import type { TemperatureData } from "@/types/models/climate";

const TEMPERATURE_ENDPOINT = "/temperature/";

export async function fetchTemperatureData(): Promise<TemperatureData> {
  const res = await apiClient.get<TemperatureData>(TEMPERATURE_ENDPOINT);
  return res.data;
}
