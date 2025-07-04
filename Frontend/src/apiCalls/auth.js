import { axiosInstance } from "./index";

// API đăng nhập
export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
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
