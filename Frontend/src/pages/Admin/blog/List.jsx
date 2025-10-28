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

const List = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [modalCreate, setModalCreate] = useState(false);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/*Tại đây bạn có thể dùng displayBlogs map() qua từng item hiể thị. Tôi muốn hiển thị đầy đủ
            desc1, desc2 nếu dài quá thì ta giới hạn và thay vào đó là dấu dots , bên trên có 2 nút là cập nhật và xóa*/}
        </div>
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
    </>
  );
};

export default List;
