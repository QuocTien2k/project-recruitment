import { postDelete } from "@api/admin";
import { showCustomConfirm } from "@components-ui/Confirm";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import PostCard from "@components-post/PostCard";
import ApprovePostSearch from "@components-search/admin/ApprovePostSearch";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Title from "@components-ui/Title";
import NoResult from "@components-states/NoResult";
import EmptyState from "@components-states/EmptyState";

const ApprovedPosts = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listPost, setListPost] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedPosts = listPost.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdatePost = (updatedPost) => {
    // Nếu bài bị xóa hoặc đã được duyệt / từ chối thì remove khỏi danh sách
    if (
      updatedPost.deleted ||
      updatedPost.status === "approved" ||
      updatedPost.status === "rejected"
    ) {
      setListPost((prev) => prev.filter((p) => p._id !== updatedPost._id));
      return;
    }

    // Nếu vẫn pending mà chưa có trong danh sách thì thêm vào
    if (updatedPost._id && !listPost.some((p) => p._id === updatedPost._id)) {
      setListPost((prev) => [updatedPost, ...prev]);
      return;
    }

    // Nếu pending và đã có trong danh sách thì update
    setListPost((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [listPost]);

  const handleDelete = (postId) => {
    showCustomConfirm({
      title: "Xóa bài tuyển dụng",
      message:
        "Bạn có chắc muốn xóa bài tuyển dụng này? Hành động này có thể ảnh hưởng đến các tính năng khác trên website.",
      onConfirm: async () => {
        try {
          const res = await postDelete(postId);
          if (res.success) {
            toast.success(res.message);
            // Cập nhật state bằng handleUpdatePost
            handleUpdatePost({ _id: res.deletedId, deleted: true });
          } else {
            toast.error(res.message || "Không thể xóa bài");
          }
        } catch (err) {
          toast.error(err?.response?.data?.message || "Lỗi khi xóa bài");
        }
      },
      onCancel: () => {
        console.log("Người dùng đã hủy xóa");
      },
    });
  };

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
      <Title text="Danh sách bài viết đã duyệt" className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <ApprovePostSearch
            onResults={setListPost}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      {showLoader ? (
        <Loading size="md" />
      ) : displayedPosts.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy bài viết nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có bài viết nào ✍️" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPosts.map((post) => (
            <PostCard
              post={post}
              key={post._id}
              showFullDescription
              onDelete={() => handleDelete(post._id)}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listPost.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ApprovedPosts;
