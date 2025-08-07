import React from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-34"
      } transition-all relative duration-300 overflow-hidden bg-gray-50 border-r border-r-gray-300 h-full`}
    >
      {/* Nút toggle - nằm trong Sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-0 translate-x-1/4 z-20 p-2 rounded-full transition"
      >
        {isOpen ? (
          <HiChevronLeft className="text-xl" />
        ) : (
          <HiChevronRight className="text-xl" />
        )}
      </button>
      {/* Logo */}
      <div className="mt-3 flex items-center justify-center">
        <Link to="/admin" className="">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-17 object-contain"
          />
        </Link>
      </div>

      {/* Nội dung sidebar ở đây */}
    </div>
  );
};

export default Sidebar;
