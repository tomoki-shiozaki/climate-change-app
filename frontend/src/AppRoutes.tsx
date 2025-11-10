import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Signup } from "./pages/auth";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { DataExplorer } from "./pages/Data";
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
      <Route
        path="/data"
        element={<PrivateRoute element={<DataExplorer />} />}
      />
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
