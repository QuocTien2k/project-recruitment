import { axiosInstance } from "./index";

export const getBlockList = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/block/blocked", {
      params: filters,
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getBlockStatus = async (receiverId) => {
  try {
    const res = await axiosInstance.get(`/api/block/status/${receiverId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi khi check block status:", err?.message);
    throw err;
  }
};

export const actionBlock = async (blockedUserId) => {
  try {
    const res = await axiosInstance.post("/api/block/block", {
      blockedUser: blockedUserId,
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const actionUnBlock = async (blockedUserId) => {
  try {
    const res = await axiosInstance.delete(
      `/api/block/unblock/${blockedUserId}`
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
