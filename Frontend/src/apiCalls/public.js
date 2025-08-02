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

export const getApprovedPost = async () => {
  try {
    const res = await axiosInstance.get("/api/public/list-posts/");

    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi dữ liệu:", err?.message);
    throw err;
  }
};

export const getPostDetail = async (slug) => {
  try {
    const res = await axiosInstance.get(`/api/public/detail-by-slug/${slug}`);

    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi dữ liệu: ", err?.message);
    throw err;
  }
};
