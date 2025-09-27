import { axiosInstance } from "./index";

export const createEmpty = async () => {
  try {
    const response = await axiosInstance.post("/api/contract/create-empty");
    return response?.data?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createWithPost = async (postId) => {
  try {
    const response = await axiosInstance.post(
      "/api/contract/create-with-post",
      { postId }
    );
    return response?.data?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const download = async (contractId) => {
  try {
    const response = await axiosInstance.get(
      `/api/contract/download/${contractId}`,
      { responseType: "blob" } //tải pdf
    );
    return response?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
