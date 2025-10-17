import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const navLinks = [
    { path: "/giao-vien-khoa-tu-nhien", label: "Giáo viên Tự nhiên" },
    { path: "/giao-vien-khoa-xa-hoi", label: "Giáo viên Xã hội" },
    { path: "/giao-vien-khoa-ngoai-ngu", label: "Giáo viên Ngoại ngữ" },
  ];

  const infoLinks = [
    { path: "/ve-chung-toi", label: "Về chúng tôi" },
    { path: "/blog", label: "Blog" },
    { path: "/lien-he", label: "Liên hệ" },
  ];

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-[var(--width-8xl)] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1: Thông tin công ty */}
        <div className="space-y-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-32 h-20 object-contain invert transition-all duration-300"
          />
          <p className="text-sm text-gray-300">Hotline: 0123 456 789</p>
          <p className="text-sm text-gray-300">
            Email: doquoctien.developer.com
          </p>
          <p className="text-sm text-gray-300">
            Địa chỉ: 123 Nguyễn Văn A, Q.1, TP.HCM
          </p>
          <p className="text-sm text-gray-300">Thời gian: 8h00 - 21h00</p>
        </div>

        {/* Cột 2: Liên kết danh mục */}
        <div>
          <h4 className="font-semibold mb-4">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="text-white hover:text-green-500 transition-colors"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Về chúng tôi */}
        <div>
          <h4 className="font-semibold mb-4">Thông tin</h4>
          <ul className="space-y-2 text-sm">
            {infoLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="text-white hover:text-green-500 transition-colors"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div>
          <h4 className="font-semibold mb-4">Kết nối</h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-600 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="mt-10 text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} TH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
