import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Button from "@/components/Button";
import MessageNotification from "@/components/MessageNotification";
import { FiPower } from "react-icons/fi";
import { setGlobalLoading } from "@/redux/loadingSlice";
import { useNavigate } from "react-router-dom";
import { clearUser, setSelectedChat, setUser } from "@/redux/currentUserSlice";
import UpdateAvatar from "@/Modals/UpdateAvatar";
import UpdatePassword from "@/Modals/UpdatePassword";
import UpdateInfo from "@/Modals/UpdateInfo";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const Header = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModalUpdateAvatar, setOpenModalUpdateAvatar] = useState(false);
  const [openModalUpdateChangePassword, setOpenModalUpdateChangePassword] =
    useState(false);
  const [openModalUpdateInfo, setOpenModalUpdateInfo] = useState(false);
  const navigate = useNavigate();
  const fullName = `${currentUser?.middleName || ""} ${
    currentUser?.name || ""
  }`.trim();

  const handleToggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
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

  const handleLogout = () => {
    dispatch(setGlobalLoading(true));

    setTimeout(() => {
      // 1. Xóa chat đang chọn (ẩn ChatArea)
      dispatch(setSelectedChat(null));

      // 2. Xoá thông tin user khỏi Redux và localStorage
      dispatch(clearUser());
      localStorage.removeItem("token");

      // 3. Tắt loading
      dispatch(setGlobalLoading(false));

      // 4. Chuyển hướng
      navigate("/");
    }, 1000);
  };

  //console.log("Thông tin: ", currentUser);

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center relative z-20">
      {/* Logo trái */}
      <div className="text-xl font-bold text-green-600">LOGO</div>

      {/* Phần phải */}
      {currentUser ? (
        <>
          <div className="flex items-center gap-4 relative">
            {/* Icon message */}
            <MessageNotification />

            {/* Avatar + Name + Dropdown */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleToggleDropdown}
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

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg animate-fade-down overflow-hidden z-20">
                <div className="py-2">
                  <div className="flex flex-col px-2">
                    {/*Avatar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                      onClick={() => setOpenModalUpdateAvatar(true)}
                    >
                      <span>🖼️</span> <span>Đổi ảnh</span>
                    </Button>

                    {/*Change Password */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                      onClick={() => setOpenModalUpdateChangePassword(true)}
                    >
                      <span>📝</span> <span>Đổi mật khẩu</span>
                    </Button>

                    {/*Infor */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                      onClick={() => setOpenModalUpdateInfo(true)}
                    >
                      <span>📝</span> <span>Thông tin</span>
                    </Button>

                    {/*My post */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                      onClick={() => {}}
                    >
                      <span>📄</span> <span>Bài viết của tôi</span>
                    </Button>

                    {/*Contract */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                      onClick={() => {}}
                    >
                      <span>✍️</span> <span>Tạo hợp đồng</span>
                    </Button>
                  </div>

                  {/*Logout */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-4 py-2 w-[65%] text-left text-red-500 hover:bg-red-50 border-t border-gray-200 mt-1"
                      onClick={handleLogout}
                    >
                      <span className="text-lg">
                        <FiPower />
                      </span>
                      <span>Đăng xuất</span>
                    </Button>
                  </div>
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
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
          <Button onClick={() => navigate("/signup")}>Đăng ký</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
