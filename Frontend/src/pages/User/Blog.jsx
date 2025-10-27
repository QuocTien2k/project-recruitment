import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon + Tiêu đề */}
      <Wrench size={50} className="text-yellow-500 mb-4 animate-spin-slow" />
      <h1 className="text-3xl font-bold mb-3 font-poppins">
        Blog đang trong quá trình phát triển 🚧
      </h1>
      <p className="text-gray-600 mb-6">
        Chúng tôi đang xây dựng không gian chia sẻ kiến thức và kinh nghiệm. Hãy
        quay lại sau nhé!
      </p>

      {/* Nút quay lại trang chủ */}
      <Link
        to="/"
        className="bg-green-500 text-white px-6 py-2 rounded-md font-medium hover:bg-green-600 transition-colors duration-200"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default Blog;
