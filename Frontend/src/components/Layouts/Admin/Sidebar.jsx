import React from "react";
import {
  HiAcademicCap,
  HiBan,
  HiCheckCircle,
  HiDocumentText,
  HiUserGroup,
  HiUserRemove,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const currentUser = useSelector((state) => state.currentUser.user);

  const baseClass = "flex items-center gap-3 py-2 transition rounded-md";
  const openClass = "px-4 justify-start";
  const closedClass = "w-14 justify-center";
  const hoverClass = "hover:bg-slate-800";
  const activeClass = "bg-slate-800";

  const menuItems = [
    {
      label: "Tài khoản hoạt động",
      icon: HiUserGroup,
      to: "/admin/tai-khoan/hoat-dong",
      roles: ["admin"],
    },
    {
      label: "Tài khoản bị khóa",
      icon: HiUserRemove,
      to: "/admin/tai-khoan/bi-khoa",
      roles: ["admin"],
    },
    {
      label: "Giáo viên hoạt động",
      icon: HiAcademicCap,
      to: "/admin/giao-vien/hoat-dong",
      roles: ["admin"],
    },
    {
      label: "Giáo viên bị khóa",
      icon: HiBan,
      to: "/admin/giao-vien/bi-khoa",
      roles: ["admin"],
    },
    {
      label: "Bài chờ duyệt",
      icon: HiDocumentText,
      to: "/admin/bai-viet/cho-duyet",
      roles: ["admin"],
    },
    {
      label: "Bài đã duyệt",
      icon: HiCheckCircle,
      to: "/admin/bai-viet/da-duyet",
      roles: ["admin"],
    },
    // { label: "Cấu hình hệ thống", icon: HiCog, to: "/admin/config" },
    // { label: "Blog", icon: HiNewspaper, to: "/admin/blog" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-24"
      } transition-all bg-slate-900 text-white relative duration-300 overflow-hidden border-r border-r-gray-300 h-full`}
    >
      {/* Logo */}
      <div className="mt-3 flex items-center justify-center">
        <NavLink to="/admin">
          <img
            src="/logo.png"
            alt="Logo"
            className={`object-contain invert transition-all duration-300 ${
              isOpen ? "w-28 h-18" : "w-10 h-10"
            }`}
          />
        </NavLink>
      </div>

      {/* Menu render bằng map */}
      <div className="mt-6 px-3 flex flex-col gap-2">
        {menuItems
          .filter((item) => item.roles.includes(currentUser?.role)) // lọc theo role
          .map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  baseClass,
                  isOpen ? openClass : closedClass,
                  hoverClass,
                  isActive ? activeClass : "",
                ].join(" ")
              }
            >
              <div
                className="flex items-center gap-3"
                title={!isOpen ? label : undefined}
              >
                <Icon size={22} />
                {isOpen && <span className="whitespace-nowrap">{label}</span>}
              </div>
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
