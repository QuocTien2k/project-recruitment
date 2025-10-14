import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import DynamicTitle from "@context/DynamicTitle";
import ScrollToTop from "@components-ui/ScrollToTop";
import ChatArea from "@components-chat/ChatArea";
import ContactAdminButton from "./components/ContactAdmin";
import Loading from "@components-ui/Loading";
import AboutUs from "@pages/User/AboutUs";
import Report from "./components/Report";

// --- Public Pages ---
const Home = lazy(() => import("@pages-user/Home"));
const Unauthorized = lazy(() => import("@pages/Unauthorized"));
const NotFound = lazy(() => import("@pages/NotFound"));
const Login = lazy(() => import("@pages-auth/Login"));
const Signup = lazy(() => import("@pages-auth/Signup"));
const ForgotPassword = lazy(() => import("@pages-auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages-auth/ResetPassword"));

// --- User Layout Pages ---
const TeacherDetail = lazy(() => import("@pages-user/TeacherDetail"));
const PostDetail = lazy(() => import("@pages-user/PostDetail"));
const MyPost = lazy(() => import("@pages-user/MyPost"));
const MyBlock = lazy(() => import("@pages/User/MyBlock"));
const MyFavorite = lazy(() => import("@pages/User/MyFavorite"));
const MyReport = lazy(() => import("@pages/User/MyReport"));
const MySavePost = lazy(() => import("@pages/User/MySavePost"));
const TeachersNatural = lazy(() => import("@pages/User/TeachersNatural"));
const TeachersSocial = lazy(() => import("@pages/User/TeachersSocial"));
const TeachersLanguages = lazy(() => import("@pages/User/TeachersLanguages"));
const ListTeachers = lazy(() => import("@pages-user/ListTeachers"));
const ListPosts = lazy(() => import("@pages/User/ListPosts"));
const PostApplicationDetail = lazy(() =>
  import("@pages/User/PostApplicationDetail")
);

// --- Admin Layout Pages ---
const AdminDashboard = lazy(() => import("@pages-admin/AdminDashboard"));
const ActiveUsers = lazy(() => import("@pages-admin/users/ActiveUsers"));
const BannedUsers = lazy(() => import("@pages-admin/users/BannedUsers"));
const ActiveTeachers = lazy(() =>
  import("@pages-admin/teachers/ActiveTeachers")
);
const BannedTeachers = lazy(() =>
  import("@pages-admin/teachers/BannedTeachers")
);
const PendingPosts = lazy(() => import("@pages-admin/posts/PendingPosts"));
const ApprovedPosts = lazy(() => import("@pages-admin/posts/ApprovedPosts"));
const ListReportPending = lazy(() =>
  import("@pages/Admin/reports/ListReportPending")
);
const ListReportResolved = lazy(() =>
  import("@pages/Admin/reports/ListReportResolved")
);

// --- Layouts ---
const UserLayout = lazy(() => import("@layouts/UserLayout"));
const AdminLayout = lazy(() => import("@layouts/AdminLayout"));

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <DynamicTitle />
        <ScrollToTop duration={1200} />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Layout User dùng chung cho user + teacher */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/giao-vien/:teacherId" element={<TeacherDetail />} />
              <Route path="/bai-viet/:slug" element={<PostDetail />} />
              <Route
                path="/bai-viet-ung-tuyen/:slug"
                element={<PostApplicationDetail />}
              />
              <Route path="/bai-viet-cua-toi" element={<MyPost />} />
              <Route path="/danh-sach-chan" element={<MyBlock />} />
              <Route path="/danh-sach-yeu-thich" element={<MyFavorite />} />
              <Route path="danh-sach-bao-cao" element={<MyReport />} />
              <Route
                path="/danh-sach-bai-viet-da-luu"
                element={<MySavePost />}
              />
              <Route
                path="/giao-vien-khoa-tu-nhien"
                element={<TeachersNatural />}
              />
              <Route
                path="/giao-vien-khoa-xa-hoi"
                element={<TeachersSocial />}
              />
              <Route
                path="/giao-vien-khoa-ngoai-ngu"
                element={<TeachersLanguages />}
              />
              <Route path="/danh-sach-giao-vien" element={<ListTeachers />} />
              <Route path="/danh-sach-bai-viet" element={<ListPosts />} />
              <Route path="/ve-chung-toi" element={<AboutUs />} />
            </Route>

            <Route path="dang-nhap" element={<Login />} />
            <Route path="quen-mat-khau" element={<ForgotPassword />} />
            <Route path="khoi-phuc-mat-khau" element={<ResetPassword />} />
            <Route path="dang-ky" element={<Signup />} />

            {/* Layout Admin riêng biệt */}
            <Route
              path="/admin"
              element={<ProtectedRoutes allowedRoles={["admin", "editor"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />

                {/* Users */}
                <Route path="tai-khoan/hoat-dong" element={<ActiveUsers />} />
                <Route path="tai-khoan/bi-khoa" element={<BannedUsers />} />

                {/* Teachers */}
                <Route
                  path="giao-vien/hoat-dong"
                  element={<ActiveTeachers />}
                />
                <Route path="giao-vien/bi-khoa" element={<BannedTeachers />} />

                {/* Posts */}
                <Route path="bai-viet/cho-duyet" element={<PendingPosts />} />
                <Route path="bai-viet/da-duyet" element={<ApprovedPosts />} />

                {/* Posts */}
                <Route
                  path="bao-cao-chua-xu-ly"
                  element={<ListReportPending />}
                />
                <Route
                  path="bao-cao-da-xu-ly"
                  element={<ListReportResolved />}
                />
              </Route>
            </Route>

            {/* Trang lỗi */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ChatArea />
        <Report />
        <ContactAdminButton />
      </Router>
    </>
  );
}

export default App;
