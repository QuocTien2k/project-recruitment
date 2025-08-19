import { useState } from "react";
import Button from "@/components/UI/Button";
import { forgotPassword } from "@api/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;
    const newErrors = {};

    //Kiểm tra rỗng
    if (!email) {
      newErrors.email = "Vui lòng nhập email!";
    }

    //kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Nếu có lỗi → set errors và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword(email);

      if (data.success) {
        const msg = data?.message || "Đã gửi email đặt lại mật khẩu";
        toast.success(msg);
        setFormData({ email: "" });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Đăng nhập thất bại, thử lại sau!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Quên mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}

          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </div>

          <div className="text-center mt-4 space-y-2 text-sm">
            <p>
              <Link to="/dang-nhap" className="text-blue-600 hover:underline">
                Quay lại
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
