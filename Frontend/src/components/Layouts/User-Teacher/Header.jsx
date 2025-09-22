import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Button from "@components-ui/Button";
import MessageNotification from "@components-chat/MessageNotification";
import { FiBookmark, FiHeart, FiMenu, FiPower, FiX } from "react-icons/fi";
import { setGlobalLoading } from "@redux/loadingSlice";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearUser, setSelectedChat, setUser } from "@redux/currentUserSlice";
import UpdateAvatar from "@modals/UpdateAvatar";
import UpdatePassword from "@modals/UpdatePassword";
import UpdateInfo from "@modals/UpdateInfo";
import { FiImage, FiLock, FiUser, FiEdit, FiList } from "react-icons/fi";
import { Ban } from "lucide-react";
import NotifiByAdmin from "../../NotifiByAdmin";
import { logout } from "@api/auth";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const Header = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // theo dõi route
  const [openModalUpdateAvatar, setOpenModalUpdateAvatar] = useState(false);
  const [openModalUpdateChangePassword, setOpenModalUpdateChangePassword] =
    useState(false);
  const [openModalUpdateInfo, setOpenModalUpdateInfo] = useState(false);
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const navLinks = [
    { path: "/giao-vien-khoa-tu-nhien", label: "Giáo viên Tự nhiên" },
    { path: "/giao-vien-khoa-xa-hoi", label: "Giáo viên Xã hội" },
    { path: "/giao-vien-khoa-ngoai-ngu", label: "Giáo viên Ngoại ngữ" },
    { path: "/ve-chung-toi", label: "Về chúng tôi" },
    { path: "/lien-he", label: "Liên hệ" },
    { path: "/blog", label: "Blog" },
  ];

  const navigate = useNavigate();
  const fullName = `${currentUser?.middleName || ""} ${
    currentUser?.name || ""
  }`.trim();

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

  //cập nhật avatar
  const handleUpdateAvatarSuccess = (url, public_id) => {
    dispatch(
      setUser({
        ...currentUser,
        profilePic: { url, public_id },
      })
    );
    setOpenModalUpdateAvatar(false);
  };

  // cập nhật thông tin
  const handleUpdateInfo = (newInfo, newTeacherInfo) => {
    dispatch(
      setUser({
        ...currentUser,
        ...newInfo, // thông tin cập nhật chung (phone, province, district,...)
        ...(currentUser.role === "teacher" && {
          teacher: {
            ...currentUser.teacher,
            ...newTeacherInfo, // thông tin riêng của teacher (workingType, timeType, description,...)
          },
        }),
      })
    );
    setOpenModalUpdateInfo(false);
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
      }, 1000);
    }
  };

  //console.log("Thông tin: ", currentUser);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-20 max-h-[72px]">
      <div className="max-w-[var(--width-8xl)] mx-auto px-6">
        <div className="flex justify-between items-center xl:grid xl:grid-cols-12">
          {/* Bên trái Logo + Hamburger */}
          <div className="xl:col-span-2 flex justify-center items-center gap-3">
            {/* Hamburger (chỉ hiện mobile) */}
            <button
              className="md:block xl:hidden p-2 text-2xl"
              onClick={() => setOpenMobileNav(true)}
            >
              <FiMenu />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-28 h-18 object-contain"
              />
            </Link>
          </div>

          {/* Ở giữa Navigation Desktop */}
          <nav className="hidden xl:flex xl:col-span-7 justify-center items-center gap-10">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Phần phải */}
          <div className="xl:col-span-3 flex justify-center items-center gap-4">
            {currentUser && currentUser?.isActive ? (
              <>
                <div className="flex items-center gap-4 relative">
                  {/* Notification by Admin */}
                  <NotifiByAdmin />

                  {/* Icon message */}
                  <MessageNotification />

                  {/* Avatar + Name + Dropdown */}
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={
                      openDropdown ? handleCloseDropdown : handleOpenDropdown
                    }
                  >
                    <img
                      src={currentUser.profilePic?.url || avatarDefault}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="max-w-[120px] truncate font-medium text-sm hidden sm:inline-block">
                      {fullName}
                    </span>
                  </div>

                  {showDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50
      ${openDropdown ? "animate-fade-in" : "animate-fade-out"}
      ${!openDropdown ? "pointer-events-none" : ""}`}
                      style={{ top: "100%" }}
                    >
                      <div className="py-2 max-h-[220px] overflow-y-auto">
                        <div className="flex flex-col px-2">
                          {/*Avatar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                            onClick={() => setOpenModalUpdateAvatar(true)}
                          >
                            <FiImage className="text-[16px]" />
                            <span>Đổi ảnh</span>
                          </Button>

                          {/*Mật khẩu */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                            onClick={() =>
                              setOpenModalUpdateChangePassword(true)
                            }
                          >
                            <FiLock className="text-[16px]" />
                            <span>Đổi mật khẩu</span>
                          </Button>

                          {/*Thông tin */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                            onClick={() => setOpenModalUpdateInfo(true)}
                          >
                            <FiUser className="text-[16px]" />
                            <span>Thông tin</span>
                          </Button>

                          {/*Danh sách chặn */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                            onClick={() => navigate("/danh-sach-chan")}
                          >
                            <Ban className="w-4 h-4" />
                            <span>Danh sách chặn</span>
                          </Button>

                          {currentUser?.role === "user" && (
                            <>
                              {/*My post */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                                onClick={() => navigate("/bai-viet-cua-toi")}
                              >
                                <FiList className="text-[16px]" />
                                <span>Bài tuyển dụng của tôi</span>
                              </Button>

                              {/*Bài viết */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                                onClick={() => {}}
                              >
                                <FiEdit className="text-[16px]" />
                                <span>Tạo hợp đồng</span>
                              </Button>

                              {/*My Favorite */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                                onClick={() => navigate("/danh-sach-yeu-thich")}
                              >
                                <FiHeart className="text-[16px]" />
                                <span>Danh sách yêu thích</span>
                              </Button>
                            </>
                          )}

                          {currentUser?.role === "teacher" && (
                            <>
                              {/*My Saved Post */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-100"
                                onClick={() =>
                                  navigate("/danh-sach-bai-viet-da-luu")
                                }
                              >
                                <FiBookmark className="text-[16px]" />
                                <span>Bài tuyển dụng đã lưu</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {/*Logout */}
                      <div className="flex justify-center sticky bottom-0 bg-white border-t border-gray-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 px-4 py-2 w-[65%] text-left text-red-500 hover:bg-red-50"
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

                {/*Modal Update Avatar */}
                {openModalUpdateAvatar && (
                  <UpdateAvatar
                    currentUserAvatar={currentUser.profilePic}
                    onClose={() => setOpenModalUpdateAvatar(false)}
                    onUpdateSuccess={handleUpdateAvatarSuccess}
                  />
                )}

                {/*Modal Update Info */}
                {openModalUpdateInfo && (
                  <UpdateInfo
                    currentUser={currentUser}
                    onClose={() => setOpenModalUpdateInfo(false)}
                    onUpdateSuccess={handleUpdateInfo}
                  />
                )}

                {/*Modal Update Password */}
                {openModalUpdateChangePassword && (
                  <UpdatePassword
                    onClose={() => setOpenModalUpdateChangePassword(false)}
                  />
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => navigate("/dang-nhap")}>
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate("/dang-ky")}>Đăng ký</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Drawer) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out
        ${openMobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header Drawer */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button
            className="p-2 text-2xl"
            onClick={() => setOpenMobileNav(false)}
          >
            <FiX />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-green-600 border-l-4 border-green-600 pl-2"
                    : "text-gray-700 hover:text-green-600"
                }`
              }
              onClick={() => setOpenMobileNav(false)} // đóng khi click
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay (click ngoài để đóng) */}
      {openMobileNav && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-20"
          onClick={() => setOpenMobileNav(false)}
        />
      )}
    </header>
  );
};

export default Header;
