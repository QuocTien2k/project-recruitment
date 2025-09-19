import { getLogged } from "@api/user";
import Footer from "@components-layouts/User-Teacher/Footer";
import Header from "@components-layouts/User-Teacher/Header";
import { setUser } from "@redux/currentUserSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = localStorage.getItem("user");
        if (!localUser) return;

        const res = await getLogged(); // có token gọi API
        if (res?.success) {
          //console.log(res.data);
          dispatch(setUser(res.data)); // lưu thông tin user hiện tại vào kho
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.log("Token không hợp lệ hoặc hết hạn:", error.message);
        localStorage.removeItem("user");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main
        className="flex-grow bg-gray-100"
        style={{ paddingTop: "var(--header-height)" }}
      >
        <div className="container-strong">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
