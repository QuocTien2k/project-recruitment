import { axiosInstance } from "./index";

//lấy thông tin user đăng nhập
export const getLogged = async () => {
  try {
    const res = await axiosInstance.get("/api/user/get-logged-user");
    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

// Lấy thông tin user theo id
export const getUserById = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/user/info-user/${id}`);
    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi lấy thông tin user theo ID:", err?.message);
    throw err;
  }
};
