import React, { useState } from "react";
import {
  HiUserGroup,
  HiUserRemove,
  HiAcademicCap,
  HiBan,
  HiDocumentText,
  HiCheckCircle,
  HiExclamationCircle,
  HiBadgeCheck,
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi";
import {
  Users2,
  UserX,
  GraduationCap,
  FileText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [openGroups, setOpenGroups] = useState({});

  const baseClass =
    "flex items-center gap-3 py-2 transition-all duration-200 ease-out rounded-md cursor-pointer";
  const openClass = "px-4 justify-start";
  const closedClass = "w-14 justify-center";
  const hoverClass = "hover:bg-slate-800";
  const activeClass =
    "bg-slate-700 font-semibold border-l-4 border-blue-500 shadow-sm";

  const handleOpenGroups = (key) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleCloseGroups = (key) => {
    // Đóng mượt hơn (ví dụ delay 300ms)
    setTimeout(() => {
      setOpenGroups((prev) => ({
        ...prev,
        [key]: false,
      }));
    }, 300); // delay 0.3s
  };

  const toggleGroup = (key) => {
    if (openGroups[key]) {
      handleCloseGroups(key);
    } else {
      handleOpenGroups(key);
    }
  };

  const menuGroups = [
    {
      key: "account",
      label: "Quản lý tài khoản",
      icon: Users2, // lucide: biểu tượng nhóm người
      children: [
        {
          label: "Tài khoản hoạt động",
          icon: HiUserGroup, // heroicon: nhóm người
          to: "/admin/tai-khoan/hoat-dong",
        },
        {
          label: "Tài khoản bị khóa",
          icon: UserX, // lucide: người có dấu X
          to: "/admin/tai-khoan/bi-khoa",
        },
      ],
    },
    {
      key: "teacher",
      label: "Quản lý giáo viên",
      icon: GraduationCap, // lucide: mũ tốt nghiệp
      children: [
        {
          label: "Giáo viên hoạt động",
          icon: HiAcademicCap, // heroicon: mũ tốt nghiệp
          to: "/admin/giao-vien/hoat-dong",
        },
        {
          label: "Giáo viên bị khóa",
          icon: HiBan, // heroicon: dấu cấm
          to: "/admin/giao-vien/bi-khoa",
        },
      ],
    },
    {
      key: "post",
      label: "Quản lý bài viết",
      icon: FileText, // lucide: tài liệu
      children: [
        {
          label: "Bài chờ duyệt",
          icon: HiExclamationCircle, // heroicon: cảnh báo chờ duyệt
          to: "/admin/bai-viet/cho-duyet",
        },
        {
          label: "Bài đã duyệt",
          icon: HiCheckCircle, // heroicon: đã duyệt
          to: "/admin/bai-viet/da-duyet",
        },
      ],
    },
    {
      key: "report",
      label: "Quản lý báo cáo",
      icon: ShieldAlert, // lucide: khiên cảnh báo
      children: [
        {
          label: "Báo cáo chưa xử lý",
          icon: HiExclamationCircle,
          to: "/admin/bao-cao-chua-xu-ly",
        },
        {
          label: "Báo cáo đã xử lý",
          icon: ShieldCheck, // lucide: khiên có dấu check
          to: "/admin/bao-cao-da-xu-ly",
        },
      ],
    },
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
      <div className="mt-6 px-3 flex flex-col gap-2 sidebar-scroll h-[calc(100vh-100px)]">
        {menuGroups.map((group) => (
          <div key={group.key}>
            {/* --- Menu cha --- */}
            <button
              onClick={() => toggleGroup(group.key)}
              className={[
                baseClass,
                isOpen ? openClass : closedClass,
                hoverClass,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <group.icon size={22} />
                {isOpen && (
                  <span className="flex items-center justify-between w-full">
                    {group.label}
                    {openGroups[group.key] ? (
                      <HiChevronDown size={18} />
                    ) : (
                      <HiChevronRight size={18} />
                    )}
                  </span>
                )}
              </div>
            </button>

            {/* --- Menu con --- */}
            {openGroups[group.key] && (
              <div
                className={`sidebar-submenu-wrapper ${
                  openGroups[group.key]
                    ? "open animate-slide-in"
                    : "animate-slide-out"
                } ml-${isOpen ? "6" : "0"} mt-1`}
              >
                <div className="flex flex-col">
                  {group.children.map(({ label, icon: Icon, to }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        [
                          "sidebar-submenu-item",
                          baseClass,
                          isOpen ? "pl-10 justify-start" : closedClass,
                          hoverClass,
                          isActive ? activeClass : "",
                        ].join(" ")
                      }
                    >
                      <div
                        className="flex items-center gap-3"
                        title={!isOpen ? label : undefined}
                      >
                        <Icon size={20} />
                        {isOpen && (
                          <span className="text-sm whitespace-nowrap">
                            {label}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
