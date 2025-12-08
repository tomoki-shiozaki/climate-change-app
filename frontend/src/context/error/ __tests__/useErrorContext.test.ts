// useErrorContext.test.ts
import { renderHook } from "@testing-library/react";
import { useErrorContext } from "../useErrorContext";
import { TestErrorProvider } from "./TestErrorProvider";

describe("useErrorContext", () => {
  it("returns context value when used within ErrorProvider", () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: TestErrorProvider,
    });

    expect(result.current.error).toBe(null);
    expect(typeof result.current.setError).toBe("function");
    expect(typeof result.current.clearError).toBe("function");
  });

  it("throws error when used outside of ErrorProvider", () => {
    const { result } = renderHook(() => useErrorContext());
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe(
      "useErrorContext must be used within an ErrorProvider"
    );
  });
});
