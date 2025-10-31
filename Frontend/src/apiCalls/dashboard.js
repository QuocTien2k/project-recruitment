import { axiosInstance } from "./index";

export const getDataDashboard = async () => {
  try {
    const res = await axiosInstance.get("/api/dashboard/");
    return res.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
