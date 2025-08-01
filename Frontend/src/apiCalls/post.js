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
