import Button from "@components-ui/Button";
import React from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegClock,
  FaUniversity,
  FaUserTie,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link } from "react-router-dom";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const CardFavorite = ({ user, handleRemove }) => {
  if (!user) return null;
  const fullName = `${user.middleName || ""} ${user.name || ""}`.trim();

  const vietsubWorkingType = {
    offline: "Offline",
    online: "Online",
    both: "Cả hai (Online và Offline)",
  };

  const vietsubFaculty = {
    xahoi: "Xã hội",
    tunhien: "Tự nhiên",
    ngoaingu: "Ngoại ngữ",
    khac: "Khác",
  };

  //console.log(user);

  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center gap-4 w-full sm:w-96 relative">
      {/* Nút Xóa */}
      <Button
        onClick={() => handleRemove(user._id)}
        variant="danger"
        size="sm"
        className="absolute top-2 right-2"
      >
        Xóa
      </Button>

      {/* Avatar */}
      <img
        src={user?.profilePic?.url || avatarDefault}
        alt={fullName}
        className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
      />

      {/* Thông tin cơ bản */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
        {user.email && (
          <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-2">
            <FaEnvelope className="text-blue-500" />
            <span className="truncate">{user.email}</span>
          </p>
        )}
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col gap-3 text-md text-gray-700 w-full">
        {/* Kinh nghiệm */}
        {user.experience !== undefined && (
          <p className="flex items-center gap-2">
            <MdWork className="text-green-500 text-lg" />
            <span className="text-sm text-gray-700">
              Kinh nghiệm:{" "}
              <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
                {user.experience} năm
              </strong>
            </span>
          </p>
        )}

        {/* Môn dạy */}
        {user.subject?.length > 0 && (
          <p className="flex items-center gap-2">
            <FaUserTie className="text-indigo-500" />
            <span>Môn dạy: {user.subject.join(", ")}</span>
          </p>
        )}

        {/* Khoa */}
        {user.faculty && (
          <p className="flex items-center gap-2">
            <FaUniversity className="text-purple-500" />
            <span>Khoa: {vietsubFaculty[user.faculty] || user.faculty}</span>
          </p>
        )}

        {/* Hình thức làm việc + thời gian */}
        {(user.workingType || user.timeType) && (
          <p className="flex items-start gap-2 col-span-full">
            <FaRegClock className="text-yellow-600" size={20} />
            <span className="block text-left">
              Hình thức làm việc:{" "}
              <i>{vietsubWorkingType[user.workingType] || user.workingType}</i>
              {user.timeType && ` / `}
              <i>{user.timeType}</i>
            </span>
          </p>
        )}

        {/* Khu vực */}
        {(user.district || user.province) && (
          <p className="flex items-center gap-2 col-span-full overflow-hidden">
            <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
            <span className="truncate whitespace-nowrap">
              Khu vực: {user.district}, {user.province}
            </span>
          </p>
        )}
      </div>

      <div className="pt-2">
        <Link
          to={`/giao-vien/${user?.teacherId}`}
          className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          👉 Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default CardFavorite;
