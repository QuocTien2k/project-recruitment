import CardUser from "@components-cards/CardUser";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import ActiveUserSearch from "@components-search/admin/ActiveUserSearch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Title from "@components-ui/Title";
import { showCustomConfirm } from "@components-ui/Confirm";
import toast from "react-hot-toast";
import { changeStatusUser, deleteUser } from "@api/admin";
import NoResult from "@components-states/NoResult";
import EmptyState from "@components-states/EmptyState";

const ActiveUsers = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listUser, setListUser] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedUsers = listUser.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdateUser = (updatedUser, action) => {
    if (action === "delete") {
      // xoá khỏi danh sách
      setListUser((prev) => prev.filter((u) => u._id !== updatedUser._id));
    } else if (action === "update") {
      // cập nhật lại trạng thái hoặc dữ liệu mới
      setListUser((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
    }
  };

  const handleToggleStatus = (user, action) => {
    const isLock = action === "lock";

    showCustomConfirm({
      title: isLock ? "Khóa tài khoản" : "Mở khóa tài khoản",
      message: `Bạn có chắc chắn muốn ${
        isLock ? "khóa" : "mở khóa"
      } tài khoản này không?`,
      onConfirm: async () => {
        try {
          const res = await changeStatusUser(user._id);
          if (res.success) {
            toast.success(res.message);
            if (res.user?.isActive) {
              // Nếu user vẫn active → update trong list
              handleUpdateUser(res.user, "update");
            } else {
              // Nếu user bị khóa → remove khỏi list (vì đang ở trang "hoạt động")
              handleUpdateUser({ _id: res.user._id }, "delete");
            }
          } else {
            toast.error(
              res.message || "Không thể thay đổi trạng thái tài khoản"
            );
          }
        } catch (err) {
          toast.error(
            err?.response?.data?.message ||
              "Lỗi khi thay đổi trạng thái tài khoản"
          );
        }
      },
      onCancel: () => {
        console.log("Admin đã hủy thao tác");
      },
    });
  };

  const handleDeleteUser = (id) => {
    showCustomConfirm({
      title: "Xóa tài khoản",
      message: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      onConfirm: async () => {
        try {
          const res = await deleteUser(id);
          if (res.success) {
            toast.success(res.message);
            // Cập nhật state bằng handleUpdateUser
            handleUpdateUser({ _id: res.deletedId }, "delete");
          } else {
            toast.error(res.message || "Không thể xóa tài khoản");
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || "Lỗi khi xóa tài khoản");
        }
      },
      onCancel: () => {
        console.log("Admin đã hủy xóa");
      },
    });
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [listUser]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  return (
    <>
      <Title text="Danh sách User hoạt động" className="mb-6" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <ActiveUserSearch
            onResults={setListUser}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      {showLoader ? (
        <Loading size="md" />
      ) : displayedUsers.length === 0 ? (
        hasSearched ? (
          <NoResult message="Rất tiếc, không tìm thấy người dùng nào phù hợp 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có người dùng đang hoạt động 🙂" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedUsers.map((user) => (
            <CardUser
              user={user}
              key={user._id}
              showActions
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listUser.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ActiveUsers;
