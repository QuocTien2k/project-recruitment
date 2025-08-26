import { axiosInstance } from "./index";

export const getBlockList = async () => {
  try {
    const res = await axiosInstance.get("/api/block/blocked");
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
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
    const res = await axiosInstance.post("/api/block/unblock", {
      blockedUser: blockedUserId,
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
