import { renderHook } from "@testing-library/react";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { TestAuthProvider } from "./TestAuthProvider";

describe("useAuthContext", () => {
  it("returns context value when used within AuthProvider", () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: TestAuthProvider,
    });

    expect(result.current.currentUsername).toBe("Alice");
    expect(result.current.authLoading).toBe(false);
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
  });

  it("throws error when used outside of AuthProvider", () => {
    let error: unknown;

    try {
      renderHook(() => useAuthContext());
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      "useAuthContext must be used within an AuthProvider"
    );
  });
});
