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

export const getTeacherDetail = async (teacherId) => {
  try {
    const res = await axiosInstance.get(`/api/public/teachers/${teacherId}`);

    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi dữ liệu của giáo viên:", err?.message);
    throw err;
  }
};
