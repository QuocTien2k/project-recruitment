import { useSelector } from "react-redux";
import { FaEnvelope, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "@components/Button";

const CardTeacher = ({ teacher, showDegree = false, showActions = false }) => {
  const avatarDefault =
    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";
  const currentUser = useSelector((state) => state.currentUser.user);

  const {
    _id,
    profilePic,
    description,
    experience,
    subject,
    timeType,
    workingType,
    userId,
  } = teacher || {};

  if (!userId) return null;

  const fullName = `${userId.middleName || ""} ${userId.name || ""}`.trim();

  const handleToggleActive = () => {
    // Gọi API đổi trạng thái isActive
  };

  const handleDelete = () => {
    // Gọi API xóa giáo viên
  };

  //console.log("Giáo viên: ", teacher);

  return (
    <div className="border rounded-xl shadow-md bg-white p-5 hover:shadow-lg transition duration-300 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={profilePic || avatarDefault}
          alt={fullName}
          className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
            <FaEnvelope className="text-blue-500" />
            <span className="truncate">{userId.email}</span>
          </p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <MdWork className="text-green-500" />
          <span>
            Kinh nghiệm: <strong>{experience} năm</strong>
          </span>
        </p>
        <p className="flex items-center gap-2">
          <FaUserTie className="text-indigo-500" />
          <span>Môn dạy: {subject?.join(", ")}</span>
        </p>
        <p className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <span className="text-yellow-600">🕒</span>
          <span>
            Hình thức làm việc:{" "}
            <i>
              {workingType} - {timeType}
            </i>
          </span>
        </p>
        <p className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <FaMapMarkerAlt className="text-red-400" />
          <span>
            Khu vực: {userId.district}, {userId.province}
          </span>
        </p>
        {description && (
          <p className="col-span-full text-gray-600 text-sm line-clamp-2 italic">
            {description}
          </p>
        )}
      </div>

      {/* Bằng cấp */}
      {showDegree && teacher?.degreeImages?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-800">🎓 Bằng cấp</p>
          <div className="flex flex-wrap gap-3">
            {teacher.degreeImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`degree-${index}`}
                className="w-16 h-16 object-cover rounded border shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Hành động cho admin */}
      {showActions && currentUser?.role === "admin" && (
        <div className="flex gap-3">
          <Button variant="default" size="sm" onClick={handleToggleActive}>
            {userId.isActive ? "Khóa" : "Mở khóa"}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      )}

      {/*Nút xem chi tiết */}
      {currentUser?.role !== "admin" && (
        <div className="pt-2 mt-3">
          <Link
            to={`/teachers/${_id}`}
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
