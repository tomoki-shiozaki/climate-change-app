import { apiClient } from "../features/auth/api/apiClient";
import type { TemperatureData } from "../types/models/climate";

export async function fetchTemperatureData(): Promise<TemperatureData> {
  const res = await apiClient.get<TemperatureData>("/temperature/");
  return res.data;
}
