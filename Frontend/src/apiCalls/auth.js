import { axiosInstance } from "./index";

// API đăng nhập
export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};
