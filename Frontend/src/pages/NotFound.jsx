import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">
        Trang không tồn tại
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Có vẻ như bạn đang cố truy cập một trang không tồn tại hoặc đã bị xóa.
        Vui lòng kiểm tra lại đường dẫn.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-200"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
