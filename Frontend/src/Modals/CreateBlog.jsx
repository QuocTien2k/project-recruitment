import { createBlog } from "@api/blog";
import Button from "@components-ui/Button";
import { setGlobalLoading } from "@redux/loadingSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const CreateBlog = ({ onClose, onChangeList }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.user);
  const [formData, setFormData] = useState({
    title: "",
    blogPic: null,
    desc1: "",
    desc2: "",
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [errors, setErrors] = useState({});

  // --- Handle change input ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "blogPic" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, blogPic: file }));
      setPreviewImg(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // --- Validate form ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề!";

    if (!formData.desc1.trim()) newErrors.desc1 = "Vui lòng nhập đoạn văn 1!";
    if (!formData.desc2.trim()) newErrors.desc2 = "Vui lòng nhập đoạn văn 2!";

    if (!formData.blogPic) newErrors.blogPic = "Vui lòng tải 1 ảnh!";

    return newErrors;
  };

  // --- Handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(setGlobalLoading(true));

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("desc1", formData.desc1);
      form.append("desc2", formData.desc2);
      form.append("blogPic", formData.blogPic);

      const res = await createBlog(form);

      if (res.success) {
        toast.success("Tạo bài viết thành công!");
        onChangeList?.("create", res.data);
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error("Lỗi tạo bài:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Tạo bài viết thất bại. Vui lòng thử lại.";
      toast.error(errorMsg);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-2xl max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-center flex-grow text-gray-800">
            Tạo bài viết
          </h3>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[480px]"
        >
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề ..."
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Desc1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đoạn văn 1
            </label>
            <textarea
              name="desc1"
              rows={4}
              placeholder="Nhập đoạn văn 1..."
              value={formData.desc1}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
            {errors.desc1 && (
              <p className="text-red-500 text-sm">{errors.desc1}</p>
            )}
          </div>

          {/* Desc2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đoạn văn 2
            </label>
            <textarea
              name="desc2"
              rows={4}
              placeholder="Nhập đoạn văn 1..."
              value={formData.desc2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
            {errors.desc2 && (
              <p className="text-red-500 text-sm">{errors.desc2}</p>
            )}
          </div>

          {/* Ảnh */}
          <div>
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

            {previewImg && (
              <div className="mt-4">
                <img
                  src={previewImg}
                  alt="Ảnh"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}

            {errors.blogPic && (
              <p className="text-red-500 text-sm mt-2">{errors.blogPic}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button onClick={onClose} variant="danger" type="button">
              Hủy
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
