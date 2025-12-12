import type {
  InternalAxiosRequestConfig,
  AxiosError as AxiosErrorBase,
} from "axios";

// DRF の API エラー型
export interface ApiErrorResponse {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown; // それ以外のフィールドも許容
}

// AxiosError を拡張
export interface AxiosErrorWithResponse<T = ApiErrorResponse>
  extends AxiosErrorBase<T> {
  config: InternalAxiosRequestConfig & { _retry?: boolean };
}
