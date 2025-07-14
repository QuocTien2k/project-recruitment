import { axiosInstance } from "./index";

//lấy thông tin user
export const getLogged = async () => {
  try {
    const res = await axiosInstance.get("/api/user/get-logged-user");
    return res?.data;
  } catch (err) {
    console.log("Có lỗi: ", err?.message);
    throw err;
  }
};
