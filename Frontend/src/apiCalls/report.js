import { axiosInstance } from "./index";

export const listReportByUser = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/user/lists", {
      params: filters, // truyền filters lên query
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi lấy danh sách:", err?.message);
    throw err;
  }
};

export const createReport = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/user/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi tạo:", err?.message);
    throw err;
  }
};

/* Admin */
export const listReportPending = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/report/pending", {
      params: filters, // truyền filters lên query
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi lấy danh sách:", err?.message);
    throw err;
  }
};

export const listReportResolved = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/api/report/resolved", {
      params: filters, // truyền filters lên query
    });
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi lấy danh sách:", err?.message);
    throw err;
  }
};

export const handleReport = async (id, data = {}) => {
  try {
    const response = await axiosInstance.put(`/api/report/handle/${id}`, data);
    return response.data;
  } catch (err) {
    console.log("Có lỗi khi xử lý:", err?.message);
    throw err;
  }
};
