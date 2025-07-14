import { getLogged } from "@/apiCalls/user";
import Footer from "@/components/Layouts/User-Teacher/Footer";
import Header from "@/components/Layouts/User-Teacher/Header";
import { setUser } from "@/redux/currentUserSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // không có token thì không cần gọi API

    const fetchUser = async () => {
      try {
        const res = await getLogged(); // có token gọi API
        if (res?.success) {
          //console.log(res.data);
          dispatch(setUser(res.data)); // lưu thông tin user hiện tại vào kho
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.log("Token không hợp lệ hoặc hết hạn:", error.message);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
