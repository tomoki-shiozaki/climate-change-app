import { AppNavbar, Footer, ErrorToast } from "@/components/common";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <ErrorToast />
      <Footer />
    </div>
  );
}
