import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { PrivateLayout } from "@/routes/PrivateLayout";

import { LoginPage, SignupPage } from "@/pages/auth";
import { Home } from "@/pages/home";
import { CO2MapPage, TemperaturePage } from "@/pages/climate";
import { DataPage } from "@/pages/data";
import { About } from "@/pages/about";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* 認証不要ページ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 認証必須ページ */}
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/climate/temperature" element={<TemperaturePage />} />
          <Route path="/climate/co2" element={<CO2MapPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
