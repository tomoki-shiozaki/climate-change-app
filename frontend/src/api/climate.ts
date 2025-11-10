import apiClient from "../api/apiClient";
import type { paths } from "../types/api";

type ClimateData =
  paths["/api/v1/climate-data/"]["get"]["responses"]["200"]["content"]["application/json"];

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
