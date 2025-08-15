import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/Post/PostCard";
import PendingPostSearch from "@/components/Search/PendingPostSearch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PendingPosts = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listPost, setListPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedPosts = listPost.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdatePost = (updatedPost) => {
    if (updatedPost.deleted) {
      setListPost((prev) => prev.filter((p) => p._id !== updatedPost._id));
    } else if (
      updatedPost._id &&
      !listPost.some((p) => p._id === updatedPost._id)
    ) {
      setListPost((prev) => [updatedPost, ...prev]);
    } else {
      setListPost((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [listPost]);

  const handleApprove = async (postId) => {};

  const handleReject = async (postId, reason) => {};

  const handleDelete = async (postId) => {};

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <PendingPostSearch onResults={setListPost} />
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
              onApprove={() => handleApprove(post._id)}
              onReject={(reason) => handleReject(post._id, reason)}
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

export default PendingPosts;
