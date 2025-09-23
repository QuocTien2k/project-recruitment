import { axiosInstance } from "./index";

export const getByPost = async (postId) => {
  try {
    const res = await axiosInstance.get(`/api/apllication/post/${postId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const createApplicationByTeacher = async (postId) => {
  try {
    const res = await axiosInstance.post(`/api/application/apply/${postId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const approveApplicationByUser = async (id) => {
  try {
    const res = await axiosInstance.patch(`/api/apllication/approve/${id}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const rejectApplicationByUser = async (id) => {
  try {
    const res = await axiosInstance.patch(`/api/apllication/reject/${id}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

//kiểm tra trạng thái
export const checkStatusTeacherByPost = async (postId) => {
  try {
    const response = await axiosInstance.get(
      `/api/application/check-status/${postId}`
    );
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi kiểm tra:", err?.message);
    throw err;
  }
};
