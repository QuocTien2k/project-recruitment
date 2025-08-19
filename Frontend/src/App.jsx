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
import ChatArea from "@/components/Chat/ChatArea";
import PostDetail from "@pages-user/PostDetail";
import MyPost from "@pages-user/MyPost";
import ActiveUsers from "@pages-admin/users/ActiveUsers";
import BannedUsers from "@pages-admin/users/BannedUsers";
import ActiveTeachers from "@pages-admin/teachers/ActiveTeachers";
import BannedTeachers from "@pages-admin/teachers/BannedTeachers";
import PendingPosts from "@pages-admin/posts/PendingPosts";
import ApprovedPosts from "@pages-admin/posts/ApprovedPosts";
import ContactAdminButton from "@components/ContactAdmin";
import ListTeachers from "@pages-user/ListTeachers";
import ScrollToTop from "@/components/UI/ScrollToTop";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <DynamicTitle />
        <ScrollToTop duration={1200} />
        <Routes>
          {/* Layout User dùng chung cho user + teacher */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/giao-vien/:teacherId" element={<TeacherDetail />} />
            <Route path="/bai-viet/:slug" element={<PostDetail />} />
            <Route path="/bai-viet-cua-toi" element={<MyPost />} />
            <Route path="/danh-sach-giao-vien" element={<ListTeachers />} />
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

              {/* Users */}
              <Route path="tai-khoan/hoat-dong" element={<ActiveUsers />} />
              <Route path="tai-khoan/bi-khoa" element={<BannedUsers />} />

              {/* Teachers */}
              <Route path="giao-vien/hoat-dong" element={<ActiveTeachers />} />
              <Route path="giao-vien/bi-khoa" element={<BannedTeachers />} />

              {/* Posts */}
              <Route path="bai-viet/cho-duyet" element={<PendingPosts />} />
              <Route path="bai-viet/da-duyet" element={<ApprovedPosts />} />
            </Route>
          </Route>

          {/* Trang lỗi */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatArea />
        <ContactAdminButton />
      </Router>
    </>
  );
}

export default App;
