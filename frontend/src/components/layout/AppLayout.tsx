import { AppNavbar, Footer, ErrorToast } from "@/components/common";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-4">
        <Outlet />
      </main>

      <ErrorToast />
      <Footer />
    </div>
  );
}
