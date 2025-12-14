import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Signup } from "@/pages/auth";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { CO2Map } from "@/pages/CO2Map";
import { DataPage } from "@/pages/Data";
import { About } from "@/pages/About";
import { Example } from "@/pages/Example";
import { PrivateLayout } from "@/routes";

export function AppRoutes() {
  return (
    <Routes>
      {/* 認証必須エリア */}
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/co2-map" element={<CO2Map />} />
        <Route path="/example" element={<Example />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* 認証ページ */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 404対策 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
