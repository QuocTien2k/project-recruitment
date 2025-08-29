import { axiosInstance } from "./index";

// Lấy tất cả thông báo
export const getAllNotifi = async () => {
  try {
    const response = await axiosInstance.get("/api/notification/");
    return response?.data?.data; // trả về thẳng danh sách notifications
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Đánh dấu 1 thông báo đã đọc
export const markNotifiAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/notification/${notificationId}/read`
    );
    return response?.data?.data; // trả về thông báo đã update
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotifiAsRead = async () => {
  try {
    const response = await axiosInstance.patch("/api/notification/read-all");
    return response?.data; // chỉ cần message success
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Xóa 1 thông báo
export const deleteNotifi = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/notification/${notificationId}`
    );
    return response?.data; // chỉ cần message success
  } catch (err) {
    console.error(err);
    throw err;
  }
};
