import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PrivateLayout } from "@/routes/PrivateLayout";
import { AuthContext } from "@/features/auth/context";

test("未認証時はログインにリダイレクト", () => {
  const mockAuthContext = {
    currentUsername: null,
    authLoading: false,
    login: async () => {},
    logout: async () => {},
    signup: async () => {},
    refreshAccessToken: async () => {},
  };

  const { container } = render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter initialEntries={["/climate/temperature"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<PrivateLayout />}>
            <Route
              path="/climate/temperature"
              element={<div>TemperaturePage</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  expect(container.innerHTML).not.toContain("TemperaturePage");
});

test("認証済み時は子ルートが表示される", () => {
  const mockAuthContext = {
    currentUsername: "Bob",
    authLoading: false,
    login: async () => {},
    logout: async () => {},
    signup: async () => {},
    refreshAccessToken: async () => {},
  };

  const { getByText } = render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter initialEntries={["/climate/temperature"]}>
        <Routes>
          <Route element={<PrivateLayout />}>
            <Route
              path="/climate/temperature"
              element={<div>TemperaturePage</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  expect(getByText("TemperaturePage")).toBeTruthy();
});
