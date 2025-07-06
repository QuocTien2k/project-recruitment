import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@layouts/AdminLayout";
import UserLayout from "@layouts/UserLayout";
import Home from "@pages-user/Home";
import Unauthorized from "@pages/Unauthorized";
import NotFound from "@pages/NotFound";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminDashboard from "@pages-admin/AdminDashboard";
import ForgotPassword from "@pages-auth/ForgotPassword";
import ResetPassword from "@pages-auth/ResetPassword";
import Login from "@pages-auth/Login";
import Signup from "@pages-auth/Signup";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Layout User dùng chung cho user + teacher */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="signup" element={<Signup />} />

          {/* Layout Admin riêng biệt */}
          <Route
            path="/admin"
            element={<ProtectedRoutes allowedRoles={["admin"]} />}
          >
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Trang lỗi */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
