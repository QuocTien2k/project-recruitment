import { useSelector } from "react-redux";
import { useState } from "react";
import Button from "@/components/Button";
import MessageNotification from "@/components/MessageNotification";
import { FiPower } from "react-icons/fi";

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
            <div className="absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg animate-fade-down overflow-hidden z-20">
              <div className="py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <span>🖼️</span> <span>Đổi ảnh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <span>📝</span> <span>Thông tin</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <span>📄</span> <span>Bài viết của tôi</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {}}
                >
                  <span>✍️</span> <span>Tạo hợp đồng</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 border-t border-gray-200 mt-1"
                  onClick={handleLogout}
                >
                  <span className="text-lg">
                    <FiPower />
                  </span>
                  <span>Đăng xuất</span>
                </Button>
              </div>
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
