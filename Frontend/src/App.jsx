import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@layout/AdminLayout";
import UserLayout from "@layout/UserLayout";
import Home from "@pages-user/Home";
import Unauthorized from "@pages/Unauthorized";
import NotFound from "@pages/NotFound";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminDashboard from "@pages-admin/AdminDashboard";
import ForgotPassword from "@pages-auth/ForgotPassword";
import ResetPassword from "@pages-auth/ResetPassword";
import Login from "@pages-auth/Login";
import Signup from "@pages-auth/Signup";
import DynamicTitle from "@context/DynamicTitle";
import TeacherDetail from "@pages-user/TeacherDetail";
import ChatArea from "@components/ChatArea";
import PostDetail from "@pages-user/PostDetail";
import MyPost from "@pages-user/MyPost";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <DynamicTitle />
        <Routes>
          {/* Layout User dùng chung cho user + teacher */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/giao-vien/:teacherId" element={<TeacherDetail />} />
            <Route path="/bai-viet/:slug" element={<PostDetail />} />
            <Route path="/bai-viet-cua-toi" element={<MyPost />} />
          </Route>

          <Route path="dang-nhap" element={<Login />} />
          <Route path="quen-mat-khau" element={<ForgotPassword />} />
          <Route path="khoi-phuc-mat-khau" element={<ResetPassword />} />
          <Route path="dang-ky" element={<Signup />} />

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
        <ChatArea />
      </Router>
    </>
  );
}

export default App;
