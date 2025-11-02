import axios from "axios";
import type { paths } from "../types/api";

type RefreshRequestData =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["requestBody"]["content"]["application/json"];
type RefreshRequest = Pick<RefreshRequestData, "refresh">;
type RefreshResponse =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["responses"]["200"]["content"]["application/json"];

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const refreshToken = async (
  data: RefreshRequest
): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(
    `${baseURL}/dj-rest-auth/token/refresh/`,
    data
  );
  return response.data;
};
