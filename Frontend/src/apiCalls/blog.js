import { axiosInstance } from "./index";

export const createBlog = async (formData) => {
  try {
    const res = await axiosInstance.post("/api/blog/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const updateBlog = async (blogId, formData) => {
  try {
    const res = await axiosInstance.patch(
      `/api/blog/update/${blogId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const res = await axiosInstance.delete(`/api/blog/delete/${blogId}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const listBlog = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/api/blog/", {
      params: filters, // truyền filters lên query
    });
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};

export const detailBlog = async (slug) => {
  try {
    const res = await axiosInstance.get(`/api/blog/${slug}`);
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
