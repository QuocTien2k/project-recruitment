import { axiosInstance } from "./index";

export const listTeachers = async () => {
  try {
    const res = await axiosInstance.get("/api/public/get-lists-teacher");

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
