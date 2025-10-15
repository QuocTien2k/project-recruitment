import { removeFavorite } from "@api/user";
import CardFavorite from "@components-cards/CardFavorite";
import MyFavoriteSearch from "@components-search/user-teacher/MyFavoriteSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import { showCustomConfirm } from "@components-ui/Confirm";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoginRequired from "../../components/LoginRequired";

const MyFavorite = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const currentUser = useSelector((state) => state.currentUser.user);

  const [myList, setMyList] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const displayedLists = myList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [myList]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  //xử lý xóa
  const handleRemove = async (teacherId) => {
    try {
      const res = await removeFavorite(teacherId);

      if (res?.success) {
        toast.success(res?.message);
        setMyList(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Xóa thất bại";
      toast.error(msg);
      console.error(msg);
    }
  };

  const handleConfirmDelete = (postId) => {
    showCustomConfirm({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa?",
      onConfirm: () => handleRemove(postId),
      onCancel: () => console.log("Hủy xoá"),
    });
  };

  if (!currentUser) return <LoginRequired />;

  return (
    <>
      <Title text="Danh sách giáo viên yêu thích" className="mb-6" />

      {/* Search */}
      <div className="p-4 rounded-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white">
        <Link
          to="/"
          className="text-green-600 font-medium transition-transform duration-300 
                       hover:text-black whitespace-nowrap"
        >
          ← Về trang chủ
        </Link>
        <div className="flex-1 min-w-0">
          <MyFavoriteSearch
            onResults={setMyList}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {showLoader ? (
        <Loading size="md" />
      ) : displayedLists.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy người nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có người nào ✍️" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedLists.map((item) => (
            <CardFavorite
              user={item}
              key={item._id}
              onDelete={() => handleConfirmDelete(item._id)}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={myList.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default MyFavorite;
