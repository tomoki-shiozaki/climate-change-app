import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { ErrorProvider, useErrorContext } from "./ErrorContext";

describe("ErrorContext", () => {
  it("should provide initial value and allow updating error", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorProvider>{children}</ErrorProvider>
    );

    const { result } = renderHook(() => useErrorContext(), { wrapper });

    // 初期値はnull
    expect(result.current.error).toBeNull();

    // setErrorで値を更新
    act(() => {
      result.current.setError("Test error");
    });
    expect(result.current.error).toBe("Test error");

    // clearErrorでnullに戻る
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it("should throw error if used outside of provider", () => {
    const { result } = renderHook(() => useErrorContext());
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe(
      "useErrorContext must be used within an ErrorProvider"
    );
  });
});
