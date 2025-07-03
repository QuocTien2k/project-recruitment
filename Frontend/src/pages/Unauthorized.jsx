import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4">
      <div className="flex items-center gap-4 mb-4">
        <FaExclamationTriangle className="text-yellow-500 text-6xl" />
        <h1 className="text-4xl font-bold text-yellow-600">
          403 - Truy cập bị từ chối
        </h1>
      </div>
      <p className="text-gray-700 text-lg mb-6 text-center max-w-md">
        Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập bằng tài
        khoản phù hợp hoặc quay lại trang chủ.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 shadow"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default Unauthorized;
