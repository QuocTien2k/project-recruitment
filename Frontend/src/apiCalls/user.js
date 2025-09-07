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

//Cập nhật avatar
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

//Cập nhật mật khẩu
export const changePassword = async (formData) => {
  try {
    const response = await axiosInstance.patch(
      "/api/user/change-password",
      formData
    );
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi cập nhật:", err?.message);
    throw err;
  }
};

//Cập nhật thông tin
export const updateInfo = async (formData) => {
  try {
    const response = await axiosInstance.patch(
      "/api/user/update-info",
      formData
    );
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi cập nhật:", err?.message);
    throw err;
  }
};

//Lấy danh sách yêu thích
export const getListFavorite = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/user/favorites", {
      params: filters, // truyền filters lên query
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi cập nhật:", err?.message);
    throw err;
  }
};

//Thêm teacher vào yêu thích
export const addFavorite = async (teacherId) => {
  try {
    const response = await axiosInstance.post("/api/user/add-favorite", {
      teacherId,
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi thêm vào yêu thích:", err?.message);
    throw err;
  }
};
