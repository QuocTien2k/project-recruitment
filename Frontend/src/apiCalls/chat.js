import { axiosInstance } from "./index";

export const getAllChats = async () => {
  try {
    const response = await axiosInstance.get("/api/chat/my-chats");
    return response?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createNewChat = async (members) => {
  let response = null;
  try {
    response = await axiosInstance.post("/api/chat/create-new-chat", {
      members,
    });
    return response?.data;
  } catch (err) {
    console.log("Có lỗi khi tạo chat:", err?.message);
    throw err;
  }
};
