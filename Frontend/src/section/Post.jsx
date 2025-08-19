import { getApprovedPost } from "@/apiCalls/public";
import Loading from "@/components/UI/Loading";
import PostCard from "@/components/Post/PostCard";
import { setGlobalLoading } from "@/redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const [listPost, setListPost] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);

  const fetchPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getApprovedPost();

      if (res?.success) {
        setListPost(res?.data);
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
    fetchPost();
  }, []);

  //console.log(listPost);

  return (
    <>
      {isGlobalLoading ? (
        <Loading size="md" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listPost.map((post) => (
              <PostCard
                post={post}
                key={post._id}
                onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Post;
