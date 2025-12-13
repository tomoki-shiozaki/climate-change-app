/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { shouldHandleGlobalError } from "@/lib/errors/shouldHandleGlobalError";

describe("shouldHandleGlobalError", () => {
  it("returns true for AxiosError with no response (network error)", () => {
    const error = new AxiosError("network error");

    const result = shouldHandleGlobalError(error);

    expect(result).toBe(true);
  });

  it("returns true for AxiosError with 5xx response", () => {
    const error = new AxiosError("server error");
    error.response = { status: 500 } as any;

    const result = shouldHandleGlobalError(error);

    expect(result).toBe(true);
  });

  it("returns false for AxiosError with 4xx response", () => {
    const error = new AxiosError("bad request");
    error.response = { status: 400 } as any;

    const result = shouldHandleGlobalError(error);

    expect(result).toBe(false);
  });

  it("returns false for normal Error", () => {
    const error = new Error("normal error");

    const result = shouldHandleGlobalError(error);

    expect(result).toBe(false);
  });

  it("returns false for non-Error value", () => {
    const error = "something bad";

    const result = shouldHandleGlobalError(error);

    expect(result).toBe(false);
  });
});
