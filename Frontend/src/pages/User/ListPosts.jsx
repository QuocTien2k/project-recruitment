import PostCard from "@components-post/PostCard";
import ListPostSearch from "@components-search/user-teacher/ListPostSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ListPosts = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listPost, setListPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  const displayedPosts = listPost.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [listPost]);

  return (
    <>
      <div className="p-4 rounded-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white">
        {/* Nút quay về trang chủ (bên trái) */}
        <div className="sm:w-1/4">
          <Link
            to="/"
            className="text-green-600 font-medium transition-transform duration-300 
             hover:text-black"
          >
            ← Về trang chủ
          </Link>
        </div>

        {/* Bộ lọc tìm kiếm (bên phải) */}
        <div className="sm:w-3/4">
          <ListPostSearch
            onResults={setListPost}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {isGlobalLoading ? (
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
              onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
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

export default ListPosts;
