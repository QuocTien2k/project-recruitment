import { getMyPosts } from "@/apiCalls/post";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/Post/PostCard";
import CreatePost from "@/Modals/CreatePost";
import { setGlobalLoading } from "@/redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const MyPost = () => {
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [myPosts, setMyPosts] = useState([]);
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const displayedPosts = myPosts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const fetchMyPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getMyPosts();

      if (res?.success) {
        setMyPosts(res?.data);
      }
    } catch (err) {
      console.error("Lỗi: ", err);
      const msg = err.response?.data?.message || "Có lỗi khi lấy dữ liệu!";
      toast.error(msg);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    fetchMyPost();
  }, []);

  const handleUpdatePost = (updatedPost) => {
    if (updatedPost.deleted) {
      //trạng thái xóa
      setMyPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== updatedPost._id)
      );
    } else if (
      updatedPost._id &&
      !myPosts.some((post) => post._id === updatedPost._id)
    ) {
      // Bài mới
      setMyPosts((prevPosts) => [updatedPost, ...prevPosts]);
    } else {
      //trạng thái update
      setMyPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    }
  };

  return (
    <>
      {isGlobalLoading ? (
        <Loading size="md" />
      ) : (
        <>
          {/* Header: Search + Create Button */}
          <div className="flex items-center justify-between mb-4">
            {/* Placeholder cho Search */}
            <div className="flex-1">
              {/* sau này sẽ thay bằng component Search */}
            </div>

            {/* Create Post Button */}
            <div className="flex-shrink-0 ml-4">
              <Button
                className="flex items-center justify-between"
                onClick={() => setOpenModalCreatePost(true)}
              >
                <FiFileText className="text-[16px] mr-1" />
                <span>Tạo bài tuyển dụng</span>
              </Button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 mb-4" />

          {/* List Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedPosts.map((post) => (
              <PostCard
                post={post}
                key={post._id}
                showOwnerActions={true}
                showFullDescription={true}
                handleUpdatePost={handleUpdatePost}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={myPosts.length}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />

          {/* Modal Create Post */}
          {openModalCreatePost && (
            <CreatePost
              onClose={() => setOpenModalCreatePost(false)}
              handleUpdatePost={handleUpdatePost}
            />
          )}
        </>
      )}
    </>
  );
};

export default MyPost;
