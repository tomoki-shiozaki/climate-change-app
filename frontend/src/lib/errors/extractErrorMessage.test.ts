import { describe, it, expect } from "vitest";
import { extractErrorMessage } from "./extractErrorMessage";
import type { AxiosErrorWithResponse } from "../../types/client";

describe("extractErrorMessage", () => {
  it("ネットワークエラーの場合（responseなし）", () => {
    const error = { message: "Network Error" } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("サーバーに接続できませんでした。");
  });

  it("サーバーエラー（500系）の場合", () => {
    const error = {
      response: { status: 503, data: undefined },
      message: "Service Unavailable",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe(
      "サーバーで問題が発生しました。時間を置いて再度お試しください。"
    );
  });

  it("dataが文字列の場合", () => {
    const error = {
      response: { data: "エラーです" },
      message: "ignored",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("エラーです");
  });

  it("data.detailがある場合", () => {
    const error = {
      response: { data: { detail: "詳細エラー" } },
      message: "ignored",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("詳細エラー");
  });

  it("data.non_field_errorsがある場合", () => {
    const error = {
      response: { data: { non_field_errors: ["非フィールドエラー"] } },
      message: "ignored",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("非フィールドエラー");
  });

  it("その他のフィールドの配列や文字列がある場合", () => {
    const error1 = {
      response: { data: { username: ["ユーザー名エラー"] } },
      message: "ignored",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error1)).toBe("ユーザー名エラー");

    const error2 = {
      response: { data: { email: "メールエラー" } },
      message: "ignored",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error2)).toBe("メールエラー");
  });

  it("どれにも当てはまらない場合、error.messageを返す", () => {
    const error = {
      response: { data: {} },
      message: "不明なエラー",
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("不明なエラー");
  });

  it("どれにも当てはまらずerror.messageもない場合、デフォルト文字列を返す", () => {
    const error = {
      response: { data: {} },
    } as AxiosErrorWithResponse;
    expect(extractErrorMessage(error)).toBe("エラーが発生しました。");
  });
});
