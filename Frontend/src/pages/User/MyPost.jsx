import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/Post/PostCard";
import MyPostSearch from "@/components/Search/MyPostSearch";
import CreatePost from "@/Modals/CreatePost";
import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useSelector } from "react-redux";

const MyPost = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [myPosts, setMyPosts] = useState([]);
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedPosts = myPosts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdatePost = (updatedPost) => {
    if (updatedPost.deleted) {
      setMyPosts((prev) => prev.filter((p) => p._id !== updatedPost._id));
    } else if (
      updatedPost._id &&
      !myPosts.some((p) => p._id === updatedPost._id)
    ) {
      setMyPosts((prev) => [updatedPost, ...prev]);
    } else {
      setMyPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <MyPostSearch onResults={setMyPosts} />
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button onClick={() => setOpenModalCreatePost(true)} size="sm">
            <FiFileText className="mr-1" /> Tạo bài tuyển dụng
          </Button>
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {isGlobalLoading ? (
        <Loading size="md" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPosts.map((post) => (
            <PostCard
              post={post}
              key={post._id}
              showOwnerActions
              showFullDescription
              handleUpdatePost={handleUpdatePost}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={myPosts.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {openModalCreatePost && (
        <CreatePost
          onClose={() => setOpenModalCreatePost(false)}
          handleUpdatePost={handleUpdatePost}
        />
      )}
    </>
  );
};

export default MyPost;
