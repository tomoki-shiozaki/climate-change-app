/* eslint-disable @typescript-eslint/no-explicit-any */
// 500 エラーを強制的に返す
export const fetchTemperatureDataWithError = async () => {
  // 実際のサーバーにリクエストを送らず、意図的にエラーを投げる
  const error: any = new Error("Internal Server Error");
  error.response = { status: 500 };
  throw error;
};
