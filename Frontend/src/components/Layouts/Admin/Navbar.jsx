import Button from "@components-ui/Button";
import { clearUser, setSelectedChat } from "@redux/currentUserSlice";
import { setGlobalLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import { FiPower } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import MessageNotification from "@components-chat/MessageNotification";
import { logout } from "@api/auth";

const avatarDefault = "https://cdn-icons-png.flaticon.com/512/3781/3781986.png";

const Navbar = ({ isOpen, toggleSidebar }) => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const dispatch = useDispatch();
  //const isGlobalLoading = useSelector((state) => state.loading.global);
  const fullName = `${currentUser?.middleName || ""} ${
    currentUser?.name || ""
  }`.trim();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // theo dõi route
  const navigate = useNavigate();

  // Tự động đóng dropdown khi URL đổi
  useEffect(() => {
    setOpenDropdown(false);
  }, [location.pathname]);

  // Bắt đầu hiện dropdown
  const handleOpenDropdown = () => {
    setShowDropdown(true);
    // setTimeout(() => setOpenDropdown(true), 10);
    requestAnimationFrame(() => {
      setOpenDropdown(true);
    });
  };

  // Đóng dropdown
  const handleCloseDropdown = () => {
    setOpenDropdown(false);
    setTimeout(() => setShowDropdown(false), 180); // chờ fade-out xong
  };

  const handleLogout = async () => {
    dispatch(setGlobalLoading(true));

    try {
      await logout(); // API xoá cookie ở backend
    } catch (error) {
      console.log("Logout API lỗi:", error.message);
    } finally {
      setTimeout(() => {
        // 1. Xóa chat đang chọn (ẩn ChatArea)
        dispatch(setSelectedChat(null));

        // 2. Xoá thông tin user khỏi Redux và localStorage
        dispatch(clearUser());
        localStorage.removeItem("user");

        // 3. Tắt loading
        dispatch(setGlobalLoading(false));

        // 4. Chuyển hướng
        navigate("/");
      }, 1500);
    }
  };

  return (
    <header className="h-16 relative px-4 flex items-center justify-between border-b bg-white shadow-sm">
      {/* Nút toggle - nằm trong Sidebar */}
      <button
        onClick={toggleSidebar}
        className="bg-slate-900 text-white cursor-pointer absolute top-3 -left-5 translate-x-1/4 z-20 py-1 pl-2 pr-1 border-l-0 rounded-t-full rounded-b-full rounded-r-full border-gray-400 transition"
      >
        {isOpen ? (
          <HiChevronLeft className="text-xl" />
        ) : (
          <HiChevronRight className="text-xl" />
        )}
      </button>

      <div className="flex-1"></div>

      <div className="flex gap-4 items-center relative">
        {/* Notification cho các role được phép */}
        <div className="relative">
          <MessageNotification />
        </div>
        {/* Avatar + Dropdown */}
        <div
          className="relative flex items-center gap-3 cursor-pointer group"
          onClick={openDropdown ? handleCloseDropdown : handleOpenDropdown}
        >
          <img
            src={avatarDefault}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 group-hover:border-green-500 transition"
          />
          <span className="max-w-[120px] truncate font-medium text-sm hidden sm:inline-block text-gray-800">
            Xin chào, {fullName}
          </span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            className={`
        absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-30
        transition-all duration-200 ease-out
        ${openDropdown ? "animate-fade-in" : "animate-fade-out"}
      `}
          >
            <div className="flex justify-center px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 w-full text-left text-red-500 hover:bg-red-50 transition"
                onClick={handleLogout}
              >
                <FiPower className="text-lg" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Phần còn lại của Navbar */}
    </header>
  );
};

export default Navbar;
