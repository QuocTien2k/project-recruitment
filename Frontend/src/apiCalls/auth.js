import { axiosInstance } from "./index";

// API đăng nhập
export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

// api đăng xuất
export const logout = async () => {
  try {
    const res = await axiosInstance.post("/api/auth/logout");
    return res?.data;
  } catch (err) {
    console.log("Lỗi logout:", err.message);
    throw err;
  }
};

// API đăng ký người dùng
export const signupUser = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/signup-user",
      formData
    );
    return response.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

// API đăng ký giáo viên (có upload ảnh)
export const signupTeacher = async (formData) => {
  const response = await axiosInstance.post(
    "/api/auth/signup-teacher",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

//quên mật khẩu
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/api/auth/forgot-password", {
    email,
  });
  return response.data;
};

//đặt mật khẩu mới
export const resetPassword = async (newPassword, token) => {
  const response = await axiosInstance.post(
    `/api/auth/reset-password?token=${token}`,
    {
      newPassword,
    }
  );
  return response.data;
};
