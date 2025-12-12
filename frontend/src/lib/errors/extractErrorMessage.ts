import type { AxiosErrorWithResponse, ApiErrorResponse } from "@/types/client";

// 型ガード
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse =>
  typeof data === "object" && data !== null;

export const extractErrorMessage = (error: AxiosErrorWithResponse): string => {
  const status = error.response?.status;
  const data = error.response?.data;

  // ネットワークエラーやサーバー応答なし
  if (!data) {
    if (!error.response) return "サーバーに接続できませんでした。";
    if (status && status >= 500 && status < 600) {
      return "サーバーで問題が発生しました。時間を置いて再度お試しください。";
    }
    // 想定外のケースに備えた保険として
    return error.message || "不明なエラーが発生しました。";
  }

  // 文字列の場合
  if (typeof data === "string") return data;

  // オブジェクトの場合
  if (isApiErrorResponse(data)) {
    if (data.detail) return data.detail;
    if (data.non_field_errors && data.non_field_errors.length > 0) {
      return data.non_field_errors[0];
    }

    for (const value of Object.values(data)) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string"
      ) {
        return value[0];
      }
      if (typeof value === "string") return value;
    }
  }

  // どれにも当てはまらなかった場合の保険
  return error.message || "エラーが発生しました。";
};
