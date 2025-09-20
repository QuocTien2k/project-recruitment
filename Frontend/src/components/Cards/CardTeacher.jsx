import { useSelector } from "react-redux";
import {
  FaEnvelope,
  FaHeart,
  FaMapMarkerAlt,
  FaRegClock,
  FaUniversity,
  FaUserTie,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "@components-ui/Button";
import { useState } from "react";
import { FiX } from "react-icons/fi";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const CardTeacher = ({
  teacher,
  showDegree = false,
  showActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const [selectedImg, setSelectedImg] = useState(null);
  const {
    _id, // id teacher document
    experience,
    subject,
    timeType,
    workingType,
    degreeImages,
    faculty,
    userId, // user info đã populate
  } = teacher || {};

  if (!userId) return null;

  const fullName = `${userId.middleName || ""} ${userId.name || ""}`.trim();

  const vietsubWorkingType = {
    offline: "Offline",
    online: "Online",
    both: "Online và Offline",
  };

  const vietsubFaculty = {
    xahoi: "Xã hội",
    tunhien: "Tự nhiên",
    ngoaingu: "Ngoại ngữ",
    khac: "Khác",
  };

  return (
    <div className="max-w-[380px] overflow-hidden relative border rounded-xl shadow-md bg-white p-3 space-y-3 hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
      {/* 2 nút hành động của Admin ở góc phải */}
      {showActions && currentUser?.role === "admin" && (
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              onToggleStatus?.(
                teacher.userId,
                teacher.userId.isActive ? "lock" : "unlock"
              )
            }
          >
            {userId.isActive ? "Khóa" : "Mở khóa"}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(teacher.userId._id)}
          >
            Xóa
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center text-sm w-full gap-2">
        {/* Avatar */}
        <img
          src={userId?.profilePic?.url || avatarDefault}
          alt={fullName}
          className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
        />

        {/* Họ tên */}
        <p className="flex items-center gap-2 min-w-0">
          <span
            className="font-semibold text-base xl:text-lg truncate"
            title={fullName}
          >
            {fullName}
          </span>
        </p>
      </div>

      {/* Thông tin cơ bản */}
      <div className="flex flex-col gap-2 text-gray-700 text-sm w-full">
        {/* Email */}
        <p className="flex items-center gap-2 min-w-0">
          <FaEnvelope className="text-blue-500 text-lg flex-shrink-0" />
          <span className="truncate" title={userId.email}>
            {userId.email}
          </span>
        </p>
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col gap-3 text-sm text-gray-700 w-full">
        <p className="flex items-center gap-2 min-w-0">
          <MdWork className="text-green-500 text-lg flex-shrink-0" />
          <span className="truncate" title={`${experience} năm`}>
            Kinh nghiệm:{" "}
            <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
              {experience} năm
            </strong>
          </span>
        </p>

        <p className="flex items-center gap-2 min-w-0">
          <FaUserTie className="text-indigo-500 flex-shrink-0" />
          <span className="truncate" title={subject?.join(", ")}>
            Môn dạy: {subject?.join(", ")}
          </span>
        </p>

        <p className="flex items-center gap-2 min-w-0">
          <FaUniversity className="text-purple-500 flex-shrink-0" />
          <span className="truncate" title={vietsubFaculty[faculty] || faculty}>
            Khoa: {vietsubFaculty[faculty] || faculty}
          </span>
        </p>

        <p className="flex items-center gap-2 min-w-0">
          <FaRegClock className="text-yellow-600 flex-shrink-0" size={18} />
          <span
            className="truncate"
            title={`${
              vietsubWorkingType[workingType] || workingType
            } / ${timeType}`}
          >
            Hình thức: <i>{vietsubWorkingType[workingType] || workingType}</i> /{" "}
            <i>{timeType}</i>
          </span>
        </p>

        <p className="flex items-center gap-2 min-w-0">
          <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
          <span
            className="truncate"
            title={`${userId.district}, ${userId.province}`}
          >
            Khu vực: {userId.district}, {userId.province}
          </span>
        </p>
      </div>

      {/* Bằng cấp */}
      {showDegree && Array.isArray(degreeImages) && degreeImages.length > 0 && (
        <div className="w-full text-left space-y-2">
          <p className="text-sm font-semibold text-gray-800">🎓 Bằng cấp</p>
          <div className="flex flex-wrap gap-3">
            {degreeImages.map((img, index) => (
              <img
                key={img?._id || index}
                src={img?.url}
                alt={`degree-${index}`}
                onClick={() => setSelectedImg(img?.url)}
                className="w-16 h-16 object-cover rounded border shadow-sm cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}
      {/* Modal xem ảnh lớn */}
      {selectedImg && (
        <div
          className="bg-modal backdrop-blur-sm"
          onClick={() => setSelectedImg(null)} // click nền để đóng
        >
          {/* Nút đóng */}
          <button
            onClick={() => setSelectedImg(null)}
            className="cursor-pointer absolute top-4 right-4 text-white bg-red-500/80 hover:bg-red-600 p-2 rounded-full transition"
          >
            <FiX size={20} />
          </button>

          {/* Ảnh */}
          <img
            src={selectedImg}
            alt="degree-full"
            className="max-w-[70%] max-h-[70%] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()} // chặn đóng khi click vào ảnh
          />
        </div>
      )}

      {/* Nút xem chi tiết */}
      {currentUser?.role !== "admin" && (
        <div className="pt-2">
          <Link
            to={`/giao-vien/${_id}`}
            className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            👉 Xem chi tiết
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardTeacher;
