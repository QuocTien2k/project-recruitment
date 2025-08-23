import { changeStatusUser, deleteUser } from "@api/admin";
import CardTeacher from "@components-cards/CardTeacher";
import InActiveTeacherSearch from "@components-search/admin/InActiveTeacherSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import { showCustomConfirm } from "@components-ui/Confirm";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import {
  removeUserFromChats,
  updateUserStatusInChats,
} from "@redux/currentUserSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const BannedTeacher = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const dispatch = useDispatch();
  const [listTeacher, setListTeacher] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedTeachers = listTeacher.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdateTeacher = (updatedTeacher, action) => {
    if (action === "delete") {
      // xoá khỏi danh sách
      setListTeacher((prev) =>
        prev.filter((t) => t?.userId?._id !== updatedTeacher?._id)
      );
    } else if (action === "update") {
      // cập nhật lại trạng thái hoặc dữ liệu mới
      setListTeacher((prev) =>
        prev.map((t) =>
          t?.userId?._id === updatedTeacher?._id
            ? { ...t, userId: updatedTeacher }
            : t
        )
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
            // console.log("[TOGGLE] res.user =>", {
            //   id: res?.user?._id,
            //   isActive: res?.user?.isActive,
            // });
            // Cập nhật redux ngay lập tức
            dispatch(
              updateUserStatusInChats({
                userId: res.user._id,
                isActive: res.user.isActive,
              })
            );
            if (!res.user?.isActive) {
              // Nếu user vẫn active → update trong list
              handleUpdateTeacher(res.user, "update");
            } else {
              // Nếu user bị khóa → remove khỏi list
              handleUpdateTeacher({ _id: res.user._id }, "delete");
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

  const handleDeleteTeacher = (id) => {
    showCustomConfirm({
      title: "Xóa tài khoản",
      message: "Bạn có chắc chắn muốn xóa tài khoản này không?",
      onConfirm: async () => {
        try {
          const res = await deleteUser(id);
          if (res.success) {
            toast.success(res.message);

            // Cập nhật redux ngay lập tức
            dispatch(removeUserFromChats(res.deletedUser._id));
            // Cập nhật state bằng handleUpdateTeacher
            handleUpdateTeacher({ _id: res.deletedUser._id }, "delete");
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
  }, [listTeacher]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  //console.log(listTeacher);

  return (
    <>
      <Title text="Danh sách giáo viên bị khóa" className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <InActiveTeacherSearch
            onResults={setListTeacher}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      {showLoader ? (
        <Loading size="md" />
      ) : displayedTeachers.length === 0 ? (
        hasSearched ? (
          <NoResult message="Rất tiếc, không tìm thấy giáo viên nào phù hợp 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có giáo viên nào bị khóa 😢" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedTeachers.map((teacher) => (
            <CardTeacher
              teacher={teacher}
              key={teacher._id}
              showActions
              showDegree
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTeacher}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listTeacher.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default BannedTeacher;
