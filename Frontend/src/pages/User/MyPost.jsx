import { getMyPosts } from "@/apiCalls/post";
import Loading from "@/components/Loading";
import PostCard from "@/components/Post/PostCard";
import { setGlobalLoading } from "@/redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const MyPost = () => {
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [myPosts, setMyPosts] = useState([]);

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
      setMyPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== updatedPost._id)
      );
    } else {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myPosts.map((post) => (
              <PostCard
                post={post}
                key={post._id}
                showOwnerActions={true}
                showFullDescription={true}
                handleUpdatePost={handleUpdatePost}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MyPost;
