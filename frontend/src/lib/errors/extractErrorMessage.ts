import type {
  AxiosErrorWithResponse,
  ApiErrorResponse,
} from "../../types/client";

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

  // 文字列が返ってきた場合
  if (typeof data === "string") return data;

  // data がオブジェクトの場合
  const obj = data as ApiErrorResponse;

  // detail
  if (obj.detail) return obj.detail;

  // non_field_errors の先頭
  if (obj.non_field_errors && obj.non_field_errors.length > 0) {
    return obj.non_field_errors[0];
  }

  // その他のフィールドの先頭の配列または文字列を返す
  for (const value of Object.values(obj)) {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
    ) {
      return value[0];
    }
    if (typeof value === "string") {
      return value;
    }
  }

  // 最終的に error.message またはデフォルト
  return error.message || "エラーが発生しました。";
};
