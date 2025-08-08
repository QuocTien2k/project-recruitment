import React from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-34"
      } transition-all bg-slate-900 text-white relative duration-300 overflow-hidden border-r border-r-gray-300 h-full`}
    >
      {/* Logo */}
      <div className="mt-3 flex items-center justify-center">
        <Link to="/admin" className="">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-18 object-contain invert"
          />
        </Link>
      </div>

      {/* Nội dung sidebar ở đây */}
    </div>
  );
};

export default Sidebar;
