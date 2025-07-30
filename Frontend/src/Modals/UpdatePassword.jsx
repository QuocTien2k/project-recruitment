import { changePassword } from "@/apiCalls/user";
import Button from "@/components/Button";
import { setUserLoading } from "@/redux/loadingSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const UpdatePassword = ({ onClose }) => {
  const isLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi đang nhập
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;
    const newErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(setUserLoading(true));
      const res = await changePassword(formData);
      if (res.success) {
        toast.success(res.message || "Đổi mật khẩu thành công!");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Thao tác thất bại!";
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
          <h3 className="text-lg font-semibold">Cập nhật mật khẩu</h3>
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
          {/* Mật khẩu hiện tại */}
          <div className="space-y-1">
            <label
              htmlFor="oldPassword"
              className="block text-sm text-gray-700"
            >
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập mật khẩu hiện tại"
            />
            {errors.oldPassword && (
              <span className="text-red-500 text-sm">{errors.oldPassword}</span>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-1">
            <label
              htmlFor="newPassword"
              className="block text-sm text-gray-700"
            >
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập mật khẩu mới"
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">{errors.newPassword}</span>
            )}
          </div>

          {/* Nhập lại */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-700"
            >
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button onClick={onClose} variant="danger">
            Hủy
          </Button>
          <Button onClick={handleSave} variant="default" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
