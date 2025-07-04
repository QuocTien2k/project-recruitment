import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/User/Home";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import LoginAdmin from "./pages/Auth/LoginAdmin";

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
          <Route path="/admin/login" element={<LoginAdmin />} />
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
