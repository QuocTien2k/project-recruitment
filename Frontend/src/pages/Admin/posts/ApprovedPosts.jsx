import { postDelete } from "@/apiCalls/admin";
import { showCustomConfirm } from "@/components/UI/Confirm";
import Loading from "@/components/UI/Loading";
import Pagination from "@/components/UI/Pagination";
import PostCard from "@/components/Post/PostCard";
import ApprovePostSearch from "@/components/Search/admin/ApprovePostSearch";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Title from "@/components/UI/Title";

const ApprovedPosts = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listPost, setListPost] = useState([]);
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
      message: "Bạn có chắc chắn muốn xóa bài tuyển dụng này không?",
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

  return (
    <>
      <Title text="Danh sách bài viết đã duyệt" className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <ApprovePostSearch onResults={setListPost} />
        </div>
      </div>

      {isGlobalLoading ? (
        <Loading size="md" />
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
