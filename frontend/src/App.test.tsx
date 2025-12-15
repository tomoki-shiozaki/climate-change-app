import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

/**
 * App.tsx は Provider の組み合わせを保証するだけなので、
 * 内部の実装はすべてモックする
 */

// AppRoutes をモック
vi.mock("@/routes/AppRoutes", () => ({
  AppRoutes: () => <div>AppRoutes</div>,
}));

// AuthContext をモック
vi.mock("@/features/auth/context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuthContext: () => ({
    authLoading: false,
  }),
}));

// ErrorContext をモック
vi.mock("./context/error", () => ({
  ErrorProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useErrorContext: () => ({
    clearError: vi.fn(),
    setError: vi.fn(),
  }),
}));

describe("App", () => {
  it("renders AppRoutes without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("AppRoutes")).toBeInTheDocument();
  });
});
