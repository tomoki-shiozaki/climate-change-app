import apiClient from "../api/apiClient";
import type { ClimateData } from "../types/models/climate";

export async function fetchClimateData(
  accessToken: string
): Promise<ClimateData[]> {
  const res = await apiClient.get<ClimateData[]>("/climate-data/", {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  return res.data;
}
