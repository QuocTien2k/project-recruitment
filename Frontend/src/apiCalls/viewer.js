import { axiosInstance } from "./index";

// ghi nhận lượt xem
export const recordPostView = async (id) => {
  try {
    const res = await axiosInstance.post(`/api/view/${id}`);
    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi ghi nhận thông tin:", err?.message);
    throw err;
  }
};

export const getPostViews = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/view/${id}`);
    return res?.data;
  } catch (err) {
    console.error("Lỗi khi lấy lượt xem:", err?.message);
    throw err;
  }
};
