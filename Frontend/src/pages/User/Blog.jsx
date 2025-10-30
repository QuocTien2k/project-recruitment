import { listBlog } from "@api/blog";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import { setUserLoading } from "@redux/loadingSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const Blog = () => {
  const isGlobalLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();
  const [allBlog, setAllBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const fetchBlog = async () => {
    try {
      dispatch(setUserLoading(true));
      const res = await listBlog();

      if (res.success) {
        setAllBlog(res.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi lấy bài blog");
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const displayedBlogs = allBlog.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [allBlog]);

  if (isGlobalLoading) return <Loading />;

  //console.log(displayedBlogs);

  return (
    <>
      <Title text="Danh sách blog" size="2xl" />

      {/* Grid layout */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {displayedBlogs.map((blog) => (
          <Link
            to={`/blog-chi-tiet/${blog.slug}`}
            key={blog._id}
            className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
          >
            <img
              src={blog.blogPic?.url}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {blog.desc1}
              </p>
              <div className="text-xs text-gray-400">
                {dayjs(blog.createdAt).format("DD/MM/YYYY")}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={allBlog.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Blog;
