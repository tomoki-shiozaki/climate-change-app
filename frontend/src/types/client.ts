export interface ApiErrorResponse {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown; // それ以外のフィールドも許容
}

export interface AxiosErrorWithResponse {
  response?: {
    status?: number;
    data?: ApiErrorResponse | string;
  };
  message?: string;
}
