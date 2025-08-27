import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

const DynamicTitle = () => {
  const location = useLocation();
  const path = location.pathname;

  const title = useMemo(() => {
    if (path === "/") return "Trang chủ";

    if (path === "/dang-nhap") return "Đăng nhập";
    if (path === "/dang-ky") return "Đăng ký";
    if (path === "/quen-mat-khau") return "Quên mật khẩu";
    if (path === "/khoi-phuc-mat-khau") return "Khôi phục mật khẩu";

    if (path === "/bai-viet-cua-toi") return "Bài viết của tôi";
    if (path === "/danh-sach-chan") return "Danh sách chặn";
    if (path.startsWith("/bai-viet/")) return "Chi tiết bài viết";
    if (path.startsWith("/giao-vien/")) return "Chi tiết giáo viên";

    if (path === "/admin") return "Trang quản trị";

    if (path === "/unauthorized") return "Không có quyền truy cập";
    if (path === "*") return "Không tìm thấy trang";

    return "Thuê gia sư | Tìm giáo viên uy tín";
  }, [path]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};
export default DynamicTitle;
