import { useSelector } from "react-redux";
import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import Button from "@/components/Button";
import MessageNotification from "@/components/MessageNotification";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const Header = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const [openDropdown, setOpenDropdown] = useState(false);

  const fullName = `${currentUser?.middleName || ""} ${
    currentUser?.name || ""
  }`.trim();

  const handleToggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
  };

  const handleLogin = () => {
    console.log("Đi đến trang đăng nhập");
  };

  const handleRegister = () => {
    console.log("Đi đến trang đăng ký");
  };

  const handleLogout = () => {
    console.log("Đăng xuất");
  };

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center relative z-20">
      {/* Logo trái */}
      <div className="text-xl font-bold text-green-600">LOGO</div>

      {/* Phần phải */}
      {currentUser ? (
        <div className="flex items-center gap-4 relative">
          {/* Icon message */}
          <MessageNotification />
          {/* Hoặc tạm thời là icon */}
          <FiMessageSquare className="text-2xl text-green-600 cursor-pointer" />

          {/* Avatar + Name + Dropdown */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleToggleDropdown}
          >
            <img
              src={currentUser.profilePic || avatarDefault}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="max-w-[120px] truncate font-medium text-sm hidden sm:inline-block">
              {fullName}
            </span>
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute top-14 right-0 w-48 bg-white border rounded shadow-md animate-fade-down">
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                Đổi ảnh
              </button>
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                Thông tin
              </button>
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                Bài viết của tôi
              </button>
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                Tạo hợp đồng
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={handleLogin}>Đăng nhập</Button>
          <Button onClick={handleRegister}>Đăng ký</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
