import apiClient from "../api/apiClient";
import type { TemperatureData } from "../types/models/climate";

export async function fetchTemperatureData(
  accessToken: string
): Promise<TemperatureData> {
  const res = await apiClient.get<TemperatureData>("/temperature/", {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  return res.data;
}
