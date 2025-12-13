import type { ReactNode } from "react";
import { AuthContext } from "@/features/auth/context";
import type { AuthContextType } from "@/features/auth/types/context";

interface Props {
  children?: ReactNode;
}

const mockAuthContext: AuthContextType = {
  currentUsername: "Alice",
  authLoading: false,
  login: async (_user) => {
    void _user;
  },
  logout: async () => {},
  signup: async (_user) => {
    void _user;
  },
  refreshAccessToken: async () => {},
};

export const TestAuthProvider = ({ children }: Props) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};
