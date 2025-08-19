import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@api/auth";
import toast from "react-hot-toast";
import Button from "@/components/UI/Button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;
    const newErrors = {};

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
      setLoading(true);
      const res = await resetPassword(newPassword, token);

      if (res.success) {
        toast.success(res.message || "Đặt lại mật khẩu thành công");
        setTimeout(() => {
          navigate("/dang-nhap");
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Thao tác thất bại!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đặt lại mật khẩu
        </h2>

        {!token ? (
          <p className="text-red-600 text-center">Link đặt lại không hợp lệ.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-700 mt-4"
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

            <div className="flex justify-center">
              <Button type="submit" disabled={loading} variant="default">
                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
