import { deleteBlog } from "@api/blog";
import BlogSearch from "@components-search/admin/BlogSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Button from "@components-ui/Button";
import { showCustomConfirm } from "@components-ui/Confirm";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import CreateBlog from "@modals/CreateBlog";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import EditBlog from "@modals/EditBlog";

const List = () => {
  const isGlobalLoading = useSelector((state) => state.loading.user);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); //chọn 1 blog
  const [listBlog, setListBlog] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;

  const displayedBlogs = listBlog.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [listBlog]);

  const handleDelete = (blogId) => {
    showCustomConfirm({
      title: "Xóa bài blog",
      message: "Bạn có chắc muốn xóa bài blog này?",
      onConfirm: async () => {
        try {
          const res = await deleteBlog(blogId);
          if (res.success) {
            toast.success(res.message);

            // Sau khi xóa cần cập nhật lại danh sách
            handleListChange("delete", blogId);
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

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  const handleListChange = (action, data) => {
    setListBlog((prev) => {
      switch (action) {
        case "create":
          // Thêm blog mới lên đầu danh sách
          return [data, ...prev];

        case "update":
          // Cập nhật blog theo id
          return prev.map((blog) =>
            blog.id === data.id ? { ...blog, ...data } : blog
          );

        case "delete":
          // Xóa blog theo id
          return prev.filter((blog) => blog.id !== data);

        default:
          return prev;
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 w-full mb-4">
        <Title text="Danh sách blog" />
        <Button onClick={() => setModalCreate(true)} variant="primary">
          Thêm bài viết
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <BlogSearch
            onResults={setListBlog}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      {showLoader ? (
        <Loading size="md" />
      ) : displayedBlogs.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy bài viết nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có bài viết nào ✍️" />
        )
      ) : (
        displayedBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-lg p-5 border border-gray-200 flex flex-col gap-4"
          >
            {/* Ảnh blog */}
            <div className="w-full h-64 overflow-hidden rounded-md">
              <img
                src={blog.blogPic?.url}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Tiêu đề */}
            <h2 className="text-2xl font-semibold text-gray-800 line-clamp-2">
              {blog.title}
            </h2>

            {/* Thông tin phụ */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>Người tạo: {blog.createdBy?.role || "Không rõ"}</span>
              <span>•</span>
              <span>{dayjs(blog.createdAt).format("DD/MM/YYYY")}</span>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <p className="text-gray-700 text-justify">
                {blog.desc1.length > 180
                  ? blog.desc1.slice(0, 180) + "..."
                  : blog.desc1}
              </p>
              <p className="text-gray-700 text-justify">
                {blog.desc2.length > 180
                  ? blog.desc2.slice(0, 180) + "..."
                  : blog.desc2}
              </p>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3 border-t pt-4 mt-2">
              <Button
                onClick={() => {
                  setSelectedBlog(blog);
                  setModalUpdate(true);
                }}
              >
                Cập nhật
              </Button>
              <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                Xóa
              </Button>
            </div>
          </div>
        ))
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listBlog.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {modalCreate && (
        <CreateBlog
          onClose={() => setModalCreate(false)}
          onChangeList={handleListChange}
        />
      )}
      {modalUpdate && (
        <EditBlog
          blog={selectedBlog}
          onClose={() => setModalUpdate(false)}
          onChangeList={handleListChange}
        />
      )}
    </>
  );
};

export default List;
