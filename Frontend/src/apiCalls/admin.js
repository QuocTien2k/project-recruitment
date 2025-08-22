import { axiosInstance } from "./index";

/**** User **** */
export const getUserActive = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/admin/get-lists-user-active", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getUserInActive = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/admin/get-lists-user-inactive", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const changeStatusUser = async (userId) => {
  try {
    const res = await axiosInstance.patch(
      `/api/admin/account-status/${userId}`
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axiosInstance.delete(
      `/api/admin/delete-account/${userId}`
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getTeacherActive = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/admin/get-lists-teacher-active", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getTeacherInActive = async (filters = {}) => {
  try {
    const res = await axiosInstance.get(
      "/api/admin/get-lists-teacher-inactive",
      {
        params: filters, // truyền filters lên query
      }
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

/**** Post **** */
export const getPostPending = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/admin/get-pending-post", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getPostApproved = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/admin/get-approved-post", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const postApproved = async (postId) => {
  try {
    const res = await axiosInstance.patch(`/api/admin/approve-post/${postId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const postReject = async (postId, reason) => {
  try {
    const res = await axiosInstance.patch(`/api/admin/reject-post/${postId}`, {
      reason,
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const postDelete = async (postId) => {
  try {
    const res = await axiosInstance.delete(`/api/admin/delete-post/${postId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
