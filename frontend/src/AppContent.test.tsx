import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContent } from "@/App";

/**
 * AppContent は
 * - authLoading による分岐
 * - ルート変更時の clearError
 * を責務とするため、必要最小限だけモックする
 */

// authLoading をテストごとに切り替えられるようにする
const mockUseAuthContext = vi.fn();

// AuthContext をモック
vi.mock("@/features/auth/context", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

// ErrorContext をモック
vi.mock("./context/error", () => ({
  useErrorContext: () => ({
    clearError: vi.fn(),
  }),
}));

// AppRoutes をモック
vi.mock("@/routes/AppRoutes", () => ({
  AppRoutes: () => <div>AppRoutes</div>,
}));

describe("AppContent", () => {
  it("authLoading が true のとき FullScreenLoading を表示する", () => {
    mockUseAuthContext.mockReturnValue({ authLoading: true });

    render(
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>
    );

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });
});
