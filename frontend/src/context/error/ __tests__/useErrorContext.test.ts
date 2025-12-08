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
    let error: unknown;

    try {
      renderHook(() => useErrorContext());
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      "useErrorContext must be used within an ErrorProvider"
    );
  });
});
