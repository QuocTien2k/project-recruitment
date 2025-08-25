import { getLogged } from "@api/user";
import Navbar from "@components-layouts/Admin/Navbar";
import Sidebar from "@components-layouts/Admin/Sidebar";
import { setUser } from "@redux/currentUserSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 2000);
      toast.error("Vui lòng đăng nhập!");
    }

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
