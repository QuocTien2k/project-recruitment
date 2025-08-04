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

export const getMyPosts = async () => {
  try {
    const res = await axiosInstance.get("/api/post/my-posts");
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
