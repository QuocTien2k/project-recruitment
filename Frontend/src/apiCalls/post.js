import { axiosInstance } from "./index";

export const createPost = async (formData) => {
  try {
    const res = await axiosInstance.post("/api/post/create-post", formData);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const getMyPosts = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/post/my-posts", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const updatePost = async (formData) => {
  try {
    const { postId, ...data } = formData;
    const res = await axiosInstance.patch(
      `/api/post/update-post/${postId}`,
      data
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await axiosInstance.delete(`/api/post/delete-post/${postId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
