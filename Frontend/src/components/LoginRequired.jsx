import { Link } from "react-router-dom";

const LoginRequired = () => {
  return (
    <div className="min-h-[60vh] bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Bạn cần đăng nhập để tiếp tục
      </h1>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Trang này chỉ dành cho người dùng đã đăng nhập. Vui lòng đăng nhập để
        truy cập nội dung hoặc tính năng này.
      </p>

      <Link
        to="/dang-nhap"
        className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-200"
      >
        🔑 Đăng nhập ngay
      </Link>
    </div>
  );
};

export default LoginRequired;
