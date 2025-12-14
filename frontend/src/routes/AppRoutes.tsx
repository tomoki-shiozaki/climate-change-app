import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { PrivateLayout } from "@/routes/PrivateLayout";

import { Login, Signup } from "@/pages/auth";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { CO2Map } from "@/pages/CO2Map";
import { DataPage } from "@/pages/Data";
import { About } from "@/pages/About";
import { Example } from "@/pages/Example";

export function AppRoutes() {
  return (
    <Routes>
      {/* 認証不要ページ */}
      <Route element={<AppLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* 認証必須ページ */}
      <Route element={<PrivateLayout />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/co2-map" element={<CO2Map />} />
          <Route path="/example" element={<Example />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
