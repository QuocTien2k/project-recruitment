import { getPostShortList } from "@api/public";
import Loading from "@components-ui/Loading";
import PostCard from "@components-post/PostCard";
import { setGlobalLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Title from "@components-ui/Title";

const ShortListPost = () => {
  const [listPost, setListPost] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);

  const fetchPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getPostShortList();

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
      <section
        className="py-10 px-2 mx-2 rounded-2xl"
        style={{
          background: "var(--bg-section-3)",
          boxShadow: "var(--section-shadow)",
        }}
      >
        <div className="max-w-[var(--width-8xl)] mx-auto px-2 space-y-6">
          {/* 📌 Tiêu đề */}
          <Title text="Danh sách bài viết" size="2xl" underline />
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
              {/* Nút Xem tất cả */}
              <div className="flex justify-center mt-6">
                <Link
                  to="/danh-sach-bai-viet"
                  className="
            py-2 px-6 
            bg-white text-black
    border border-green-400
    rounded-lg 
    shadow-sm
    hover:bg-green-50 hover:border-green-500
            transition 
            font-medium duration-300 transform hover:scale-95"
                >
                  Xem tất cả bài viết
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ShortListPost;
