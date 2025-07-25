import React, { useState } from "react";
import Button from "@/components/Button";
import { MdClose } from "react-icons/md";
import { updateAvatar } from "@/apiCalls/user";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading } from "@/redux/loadingSlice";

const UpdateAvatar = ({ onClose, currentUserAvatar, onUpdateSuccess }) => {
  const defaultAvatar =
    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

  const [preview, setPreview] = useState(
    currentUserAvatar?.url || defaultAvatar
  );
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 100 * 1024 * 1024; // 100MB

    // Kiểm tra định dạng
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh PNG, JPG, JPEG, WEBP.");
      return;
    }

    // Kiểm tra dung lượng
    if (file.size > maxSize) {
      toast.error("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 100MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setErrors({ file: "Vui lòng chọn ảnh đại diện mới." });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      dispatch(setUserLoading(true));
      const res = await updateAvatar(formData); // gọi API từ service

      if (res.success) {
        toast.success(res.message);
      }
      const { user: url, public_id } = res.avatar;

      // Cập nhật lại UI và Redux
      onUpdateSuccess(url, public_id);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      const msg = error.response?.data?.message || "Cập nhật thất bại";
      toast.error(msg);
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Cập nhật ảnh đại diện</h3>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="cursor-pointer p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Ảnh mới:
            </label>

            <label
              htmlFor="upload-avatar"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Chọn ảnh
            </label>

            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-4">
              <img
                src={preview}
                alt="Ảnh preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>

            {errors.file && (
              <p className="text-red-500 text-sm mt-2">{errors.file}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button onClick={onClose} variant="danger">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvatar;
