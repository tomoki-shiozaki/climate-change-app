import { AppNavbar, Footer, ErrorToast } from "@/components/common";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <AppNavbar />
      <main className="mt-4 flex-1 max-w-7xl mx-auto px-4">
        <Outlet />
      </main>
      <ErrorToast />
      <Footer />
    </>
  );
}
