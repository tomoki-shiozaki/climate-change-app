import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Signup } from "./pages/auth";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { CO2Map } from "./pages/CO2Map";
import { DataPage } from "./pages/Data";
import { About } from "./pages/About";
import { PrivateRoute } from "./components/auth";

function AppRoutes() {
  return (
    <Routes>
      {/* ホームは / */}
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} />}
      />
      {/* CO2地図専用ページ */}
      <Route path="/co2-map" element={<PrivateRoute element={<CO2Map />} />} />
      <Route path="/data" element={<PrivateRoute element={<DataPage />} />} />
      <Route path="/about" element={<PrivateRoute element={<About />} />} />

      {/* 認証ページ */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 404対策 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
