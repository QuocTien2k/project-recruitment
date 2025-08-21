import { useSelector } from "react-redux";
import { FaEnvelope, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "@components-ui/Button";

const CardTeacher = ({
  teacher,
  showDegree = false,
  showActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const avatarDefault =
    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";
  const currentUser = useSelector((state) => state.currentUser.user);

  const {
    _id, // id teacher document
    experience,
    subject,
    timeType,
    workingType,
    degreeImages,
    userId, // user info đã populate
  } = teacher || {};

  if (!userId) return null;

  const fullName = `${userId.middleName || ""} ${userId.name || ""}`.trim();

  return (
    <div className="max-w-[380px] relative border rounded-xl shadow-md bg-white p-5 hover:shadow-lg transition duration-300 space-y-5 flex flex-col items-center text-center">
      {/* 2 nút hành động của Admin ở góc phải */}
      {showActions && currentUser?.role === "admin" && (
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              onToggleStatus?.(userId, userId.isActive ? "lock" : "unlock")
            }
          >
            {userId.isActive ? "Khóa" : "Mở khóa"}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(userId._id)}
          >
            Xóa
          </Button>
        </div>
      )}

      {/* Avatar */}
      <img
        src={userId?.profilePic?.url || avatarDefault}
        alt={fullName}
        className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
      />

      {/* Thông tin cơ bản */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
        <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-2">
          <FaEnvelope className="text-blue-500" />
          <span className="truncate">{userId.email}</span>
        </p>
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col gap-3 text-md text-gray-700 w-full">
        <p className="flex items-center gap-2 justify-center sm:justify-start">
          <MdWork className="text-green-500 text-lg" />
          <span className="text-sm text-gray-700">
            Kinh nghiệm:{" "}
            <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
              {experience} năm
            </strong>
          </span>
        </p>

        <p className="flex items-center gap-2 justify-center sm:justify-start">
          <FaUserTie className="text-indigo-500" />
          <span>Môn dạy: {subject?.join(", ")}</span>
        </p>

        <p className="flex items-center gap-2 col-span-full justify-center sm:justify-start">
          <span className="text-yellow-600">🕒</span>
          <span>
            Hình thức làm việc:{" "}
            <i>
              {workingType} - {timeType}
            </i>
          </span>
        </p>

        <p className="flex items-center gap-2 col-span-full justify-center sm:justify-start overflow-hidden">
          <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
          <span className="truncate whitespace-nowrap">
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
                className="w-16 h-16 object-cover rounded border shadow-sm"
              />
            ))}
          </div>
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
