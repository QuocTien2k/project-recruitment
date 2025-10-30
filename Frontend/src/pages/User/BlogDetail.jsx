import { detailBlog, listBlog } from "@api/blog";
import Loading from "@components-ui/Loading";
import { setUserLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Title from "@components-ui/Title";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.user);

  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);

  const fetchBlogDetail = async () => {
    try {
      dispatch(setUserLoading(true));
      const res = await detailBlog(slug);
      if (res.success) setBlog(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi lấy chi tiết blog");
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  const fetchOtherBlogs = async () => {
    try {
      const res = await listBlog();
      if (res.success) {
        // Lọc bỏ bài hiện tại
        const others = res.data.filter((b) => b.slug !== slug).slice(0, 5); // chỉ hiển thị 5 bài khác
        setOtherBlogs(others);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
    fetchOtherBlogs();
  }, [slug]);

  if (isGlobalLoading || !blog) return <Loading />;

  return (
    <div className="max-w-[var(--width-8xl)] mx-auto p-4">
      {/* NÚT QUAY LẠI TRANG BLOG */}
      <div className="mb-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span>Quay lại Blog</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* CỘT TRÁI: CHI TIẾT BLOG */}
        <div className="md:col-span-9 bg-white p-6 rounded-lg shadow-sm text-justify space-y-8">
          <section>
            <Title text={blog.title} size="2xl" className="mb-3 font-poppins" />
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span>Người đăng: {blog.createdBy?.role}</span>
              <span>•</span>
              <span>{dayjs(blog.createdAt).format("DD/MM/YYYY")}</span>
            </div>
            <img
              src={blog.blogPic?.url}
              alt={blog.title}
              className="w-full rounded-lg mb-6 object-cover"
            />
            <p className="text-gray-700 leading-relaxed mb-4">{blog.desc1}</p>
            <p className="text-gray-700 leading-relaxed">{blog.desc2}</p>
          </section>
        </div>

        {/* CỘT PHẢI: BÀI VIẾT KHÁC */}
        <div className="md:col-span-3 space-y-6 bg-gray-50 p-4 rounded-lg shadow-sm self-start">
          <Title
            text="Bài viết khác"
            size="xl"
            className="font-poppins text-gray-800"
          />

          <div className="space-y-5">
            {otherBlogs.map((item) => (
              <Link
                to={`/blog-chi-tiet/${item.slug}`}
                key={item._id}
                className="block group hover:bg-white transition rounded-lg overflow-hidden"
              >
                <img
                  src={item.blogPic?.url}
                  alt={item.title}
                  className="w-full h-28 object-cover"
                />
                <div className="p-3">
                  <h4 className="text-gray-800 font-medium text-sm group-hover:text-green-600 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
