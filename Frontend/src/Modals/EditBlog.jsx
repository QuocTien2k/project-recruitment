import { updateBlog } from "@api/blog";
import Button from "@components-ui/Button";
import { setUserLoading } from "@redux/loadingSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const EditBlog = ({ blog, onClose, onChangeList }) => {
  const isLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: blog.title || "",
    desc1: blog.desc1 || "",
    desc2: blog.desc2 || "",
    blogPic: blog.blogPic || null,
  });
  const [previewImg, setPreviewImg] = useState(blog.blogPic?.url || "");
  const [errors, setErrors] = useState({});

  // --- Handle change input ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "blogPic" && files?.length > 0) {
      const file = files[0];

      // chỉ nhận ảnh hợp lệ
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn tệp hình ảnh hợp lệ");
        return;
      }

      setFormData((prev) => ({ ...prev, blogPic: file }));
      setPreviewImg(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // reset lỗi của field đó
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // --- Validate form ---
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Vui lòng nhập tiêu đề";
    if (!formData.desc1.trim()) errors.desc1 = "Vui lòng nhập mô tả 1";
    if (!formData.desc2.trim()) errors.desc2 = "Vui lòng nhập mô tả 2";
    if (!formData.blogPic)
      errors.blogPic = "Vui lòng chọn hình ảnh cho bài viết";

    return errors;
  };

  // --- Handle edit ---
  const handleEdit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      dispatch(setUserLoading(true));

      const data = new FormData();
      data.append("title", formData.title);
      data.append("desc1", formData.desc1);
      data.append("desc2", formData.desc2);

      // Nếu blogPic là file mới, append nó
      if (formData.blogPic instanceof File) {
        data.append("blogPic", formData.blogPic);
      }

      const updatedBlog = await updateBlog(blog._id, data);

      onChangeList("update", updatedBlog.data);
      toast.success("Cập nhật bài viết thành công!");
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật bài:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Cập nhật bài blog thất bại. Vui lòng thử lại.";
      toast.error(errorMsg);
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-2xl max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b w-full">
          <h3 className="flex-shrink-0 flex-grow text-lg font-semibold text-center min-w-[120px]">
            Cập nhật bài blog
          </h3>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="cursor-pointer flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-600 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 space-y-4 scroll-y-hidden max-h-[480px]">
          {/* Tiêu đề */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập tiêu đề"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Mô tả 1*/}
          <div className="space-y-1">
            <label htmlFor="desc1" className="block text-sm text-gray-700">
              Mô tả 1
            </label>
            <textarea
              id="desc1"
              name="desc1"
              value={formData.desc1}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              placeholder="Mô tả yêu cầu ...."
            />
            {errors.desc1 && (
              <p className="text-red-500 text-sm">{errors.desc1}</p>
            )}
          </div>

          {/* Mô tả 2*/}
          <div className="space-y-1">
            <label htmlFor="desc2" className="block text-sm text-gray-700">
              Mô tả 2
            </label>
            <textarea
              id="desc2"
              name="desc2"
              value={formData.desc2}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              placeholder="Mô tả yêu cầu ...."
            />
            {errors.desc2 && (
              <p className="text-red-500 text-sm">{errors.desc2}</p>
            )}
          </div>

          {/* Hình ảnh*/}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn 1 hình ảnh
            </label>

            <label
              htmlFor="upload-blog-pic"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Chọn ảnh
            </label>

            <input
              id="upload-blog-pic"
              type="file"
              name="blogPic"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {errors.blogPic && (
              <p className="text-red-500 text-sm">{errors.blogPic}</p>
            )}

            {previewImg && (
              <div className="mt-2">
                <img
                  src={previewImg}
                  alt="Xem trước"
                  className="w-full h-48 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button onClick={onClose} variant="danger">
            Hủy
          </Button>
          <Button onClick={handleEdit} variant="default" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
