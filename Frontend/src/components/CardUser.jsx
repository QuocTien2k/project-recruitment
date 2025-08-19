import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Button from "@components/Button";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const CardUser = ({ user, onToggleStatus, onDelete, showActions = true }) => {
  if (!user) return null;

  const fullName = `${user.middleName || ""} ${user.name || ""}`.trim();
  const id = user._id || user.id;

  return (
    <div className="max-w-[380px] relative border rounded-xl shadow-md bg-white p-5 hover:shadow-lg transition duration-300 space-y-5 flex flex-col items-center text-center">
      {/* Action cho Admin */}
      {showActions && (
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button
            variant="default"
            size="sm"
            onClick={() => onToggleStatus?.(id)}
          >
            {user.isActive ? "Khóa" : "Mở khóa"}
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(id)}>
            Xóa
          </Button>
        </div>
      )}

      {/* Avatar */}
      <img
        src={user?.profilePic?.url || avatarDefault}
        alt={fullName || "user-avatar"}
        className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
      />

      {/* Họ tên + ID */}
      <div className="w-full space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
        <p className="text-xs text-gray-500 break-all" title={id}>
          ID: <span className="font-mono">{id}</span>
        </p>
      </div>

      {/* Thông tin liên hệ & khu vực */}
      <div className="flex flex-col gap-3 text-sm text-gray-700 w-full">
        <p className="flex items-center gap-2 justify-center sm:justify-start">
          <FaPhoneAlt className="text-green-500" />
          <span>{user.phone}</span>
        </p>

        <p className="flex items-center gap-2 justify-center sm:justify-start">
          <FaEnvelope className="text-blue-500" />
          <span className="truncate" title={user.email}>
            {user.email}
          </span>
        </p>

        <p className="flex items-center gap-2 justify-center sm:justify-start">
          <FaMapMarkerAlt className="text-red-400" />
          <span
            className="truncate"
            title={`${user.district}, ${user.province}`}
          >
            {user.district}, {user.province}
          </span>
        </p>
      </div>

      {/* Badge trạng thái */}
      <div className="pt-1">
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full shadow-sm ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isActive ? "Đang hoạt động" : "Đã khóa"}
        </span>
      </div>
    </div>
  );
};

export default CardUser;
