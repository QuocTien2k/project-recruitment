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

export const updateAvatar = async (formData) => {
  try {
    const response = await axiosInstance.patch(
      "/api/user/update-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi cập nhật:", err?.message);
    throw err;
  }
};
