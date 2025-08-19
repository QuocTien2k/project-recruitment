import CardUser from "@/components/CardUser";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import ActiveUserSearch from "@/components/Search/admin/ActiveUserSearch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ActiveUsers = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listUser, setListUser] = useState([]);
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

  const handleToggleStatus = async (id) => {};

  const handleDeleteUser = async (id) => {};

  useEffect(() => {
    setCurrentPage(0);
  }, [listUser]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <ActiveUserSearch onResults={setListUser} />
        </div>
      </div>

      {isGlobalLoading ? (
        <Loading size="md" />
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
