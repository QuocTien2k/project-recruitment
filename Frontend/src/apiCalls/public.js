import { axiosInstance } from "./index";

export const getTeacherShortList = async () => {
  try {
    const res = await axiosInstance.get("/api/public/get-teacher-short-list");

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getListTeacher = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/public/get-list-teachers", {
      params: filters,
    });

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

//tu nhien
export const getTeachersNatural = async (filters = {}) => {
  try {
    const res = await axiosInstance.get(`/api/public/teachers-natural`, {
      params: filters,
    });

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

//xa hoi
export const getTeachersSocial = async (filters = {}) => {
  try {
    const res = await axiosInstance.get(`/api/public/teachers-social`, {
      params: filters,
    });

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getTeachersLanguages = async (filters = {}) => {
  try {
    const res = await axiosInstance.get(`/api/public/teachers-languages`, {
      params: filters,
    });

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

export const getApprovedPost = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/public/list-posts/", {
      params: filters, // truyền filters lên query
    });

    return res?.data;
  } catch (err) {
    console.log("Có lỗi khi dữ liệu:", err?.message);
    throw err;
  }
};

export const getPostShortList = async () => {
  try {
    const res = await axiosInstance.get("/api/public/get-post-short");

    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
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
