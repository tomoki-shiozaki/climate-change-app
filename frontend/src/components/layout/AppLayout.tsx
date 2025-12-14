import { Container } from "react-bootstrap";
import { AppNavbar, Footer, ErrorToast } from "@/components/common";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <AppNavbar />
      <Container className="mt-4 flex-grow-1">
        <Outlet />
      </Container>
      <ErrorToast />
      <Footer />
    </>
  );
}
