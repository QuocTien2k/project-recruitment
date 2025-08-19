import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/UI/Button";
import { login } from "@/apiCalls/auth";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
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

  //xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    const newErrors = {};

    //Kiểm tra rỗng
    if (!email) {
      newErrors.email = "Vui lòng nhập email!";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
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
      const data = await login({ email, password });

      //Lưu token và user vào localStorage
      localStorage.setItem("token", data.token);
      //localStorage.setItem("user", JSON.stringify(data.user));

      // Decode token để lấy role
      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      if (data?.success) {
        setErrors({});
      }

      // Điều hướng theo role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/*Field email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/*Field password */}
          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </div>

          <div className="text-center mt-4 space-y-2 text-sm">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link to="/dang-ky" className="text-blue-600 hover:underline">
                Đăng ký
              </Link>
            </p>
            <p>
              <Link
                to="/quen-mat-khau"
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
