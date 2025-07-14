import { useSelector } from "react-redux";
import { FaEnvelope, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { MdWork } from "react-icons/md";

const CardTeacher = ({ teacher, showDegree = false, showActions = false }) => {
  const avatarDefault =
    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";
  const currentUser = useSelector((state) => state.currentUser.user);

  const { _id, description, experience, subject, timeType, userId } =
    teacher || {};

  if (!userId) return null;

  const fullName = `${userId.middleName || ""} ${userId.name || ""}`.trim();

  const handleToggleActive = () => {
    // Gọi API đổi trạng thái isActive
  };

  const handleDelete = () => {
    // Gọi API xóa giáo viên
  };

  console.log("Giáo viên: ", teacher);

  return (
    <div className="border rounded-lg shadow p-4 bg-white hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <img
          src={userId.profilePic || avatarDefault}
          alt={fullName}
          className="w-16 h-16 object-cover rounded-full border"
        />
        <div>
          <h2 className="text-lg font-semibold">{fullName}</h2>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaEnvelope className="text-gray-400" /> {userId.email}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-700">
        <p className="flex items-center gap-1">
          <MdWork className="text-gray-500" />
          Kinh nghiệm: <strong>{experience} năm</strong>
        </p>
        <p className="flex items-center gap-1">
          <FaUserTie className="text-gray-500" />
          Môn dạy: {subject?.join(", ")}
        </p>
        <p className="flex items-center gap-1">
          🕒 Hình thức làm việc:{" "}
          <span className="italic">
            {userId.workingType} - {timeType}
          </span>
        </p>
        <p className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-gray-500" />
          Khu vực: {userId.district}, {userId.province}
        </p>
        {description && (
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Phần bằng cấp chỉ admin mới thấy nếu truyền showDegree */}
      {showDegree && teacher?.degreeImages?.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Bằng cấp:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {teacher.degreeImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`degree-${index}`}
                className="w-16 h-16 object-cover border rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Hành động admin */}
      {showActions && currentUser?.role === "admin" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleToggleActive}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            {userId.isActive ? "Khóa" : "Mở khóa"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default CardTeacher;
