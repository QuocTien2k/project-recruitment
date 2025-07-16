import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const DynamicTitle = () => {
  const location = useLocation();
  const path = location.pathname;

  const customTitleMap = [
    { match: "/admin", title: "Quản trị" },
    { match: "/login", title: "Đăng nhập" },
    { match: "/signup", title: "Đăng ký" },
    { match: "/forgot-password", title: "Quên mật khẩu" },
    { match: "/reset-password", title: "Cập nhật mật khẩu" },
    { match: "/", title: "Trang chủ" },
  ];

  const matched = customTitleMap.find(({ match }) => path.startsWith(match));
  const title = matched ? matched.title : "Thuê gia sư";

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default DynamicTitle;
