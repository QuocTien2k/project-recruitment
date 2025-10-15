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
    if (path === "/danh-sach-yeu-thich") return "Danh sách yêu thích";
    if (path === "/danh-sach-bao-cao") return "Danh sách báo cáo";
    if (path === "/danh-sach-bai-viet-da-luu")
      return "Danh sách bài viết đã lưu";

    if (path === "/giao-vien-khoa-ngoai-ngu") return "Khoa ngoại ngữ";
    if (path === "/giao-vien-khoa-tu-nhien") return "Khoa tự nhiên";
    if (path === "/giao-vien-khoa-xa-hoi") return "Khoa xã hội";

    if (path.startsWith("/bai-viet/")) return "Bài viết chi tiết";
    if (path.startsWith("/giao-vien/")) return "Thông tin giáo viên";
    if (path.startsWith("/bai-viet-ung-tuyen/")) return "Bài viết ứng tuyển";

    if (path === "/ve-chung-toi") return "Về chúng tôi";
    if (path === "/dang-nhap") return "Đăng nhập";

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
