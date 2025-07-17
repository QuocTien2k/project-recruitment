import { axiosInstance } from "./index";

export const createNewMessage = async (message) => {
  try {
    const response = await axiosInstance.post(
      "/api/message/new-message",
      message
    );

    return response?.data;
  } catch (err) {
    console.log("Có lỗi khi tạo tin:", err?.message);
    throw err;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(
      `/api/message/get-messages/${chatId}`
    );

    return response?.data;
  } catch (err) {
    console.log("Có lỗi khi lấy tin:", err?.message);
    throw err;
  }
};

export const clearUnreadMessageCount = async (chatId) => {
  let response = null;
  try {
    response = await axiosInstance.post(
      "/api/message/clear-unread-message-count",
      {
        chatId: chatId,
      }
    );
    return response?.data;
  } catch (err) {
    console.log("Có lỗi khi đánh dấu đã đọc:", err?.message);
    throw err;
  }
};
