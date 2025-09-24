// TeacherApplications.jsx
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaUserTie,
  FaUniversity,
  FaRegClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Button from "@components-ui/Button";

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

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const TeacherApplications = ({ applications, onAccept, onReject }) => {
  return (
    <div className="flex flex-col gap-6">
      {applications?.map((app) => {
        const { _id, applicant } = app;
        const { user, teacher } = applicant;

        const fullName = `${user?.middleName || ""} ${user?.name || ""}`.trim();

        return (
          <div
            key={_id}
            className="relative max-w-[380px] overflow-hidden border rounded-xl shadow-md bg-white p-3 space-y-3 hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
          >
            {/* Action buttons */}
            {app.status === "pending" ? (
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onAccept(_id)}
                >
                  Đồng ý
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onReject(_id)}
                >
                  Từ chối
                </Button>
              </div>
            ) : (
              <span
                className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${
                  app.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.status === "accepted" ? "Đã duyệt" : "Đã từ chối"}
              </span>
            )}

            {/* Avatar + Name */}
            <div className="flex flex-col items-center justify-center text-sm w-full gap-2">
              <img
                src={user?.profilePic?.url || avatarDefault}
                alt={fullName}
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
              />
              <p className="flex items-center gap-2 min-w-0">
                <span
                  className="font-semibold text-base xl:text-lg truncate"
                  title={fullName}
                >
                  {fullName}
                </span>
              </p>
            </div>

            {/* Basic info */}
            <div className="flex flex-col gap-2 text-gray-700 text-sm w-full">
              <p className="flex items-center gap-2 min-w-0">
                <FaEnvelope className="text-blue-500 text-lg flex-shrink-0" />
                <span className="truncate" title={user?.email}>
                  {user?.email}
                </span>
              </p>
            </div>

            {/* Teacher info */}
            {teacher ? (
              <div className="flex flex-col gap-3 text-sm text-gray-700 w-full">
                <p className="flex items-center gap-2 min-w-0">
                  <MdWork className="text-green-500 text-lg flex-shrink-0" />
                  <span
                    className="truncate"
                    title={`${teacher.experience} năm`}
                  >
                    Kinh nghiệm:{" "}
                    <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
                      {teacher.experience} năm
                    </strong>
                  </span>
                </p>

                <p className="flex items-center gap-2 min-w-0">
                  <FaUserTie className="text-indigo-500 flex-shrink-0" />
                  <span
                    className="truncate"
                    title={teacher.subject?.join(", ")}
                  >
                    Môn dạy: {teacher.subject?.join(", ")}
                  </span>
                </p>

                <p className="flex items-center gap-2 min-w-0">
                  <FaUniversity className="text-purple-500 flex-shrink-0" />
                  <span
                    className="truncate"
                    title={vietsubFaculty[teacher.faculty] || teacher.faculty}
                  >
                    Khoa: {vietsubFaculty[teacher.faculty] || teacher.faculty}
                  </span>
                </p>

                <p className="flex items-center gap-2 min-w-0">
                  <FaRegClock
                    className="text-yellow-600 flex-shrink-0"
                    size={18}
                  />
                  <span
                    className="truncate"
                    title={`${
                      vietsubWorkingType[teacher.workingType] ||
                      teacher.workingType
                    } / ${teacher.timeType}`}
                  >
                    Hình thức:{" "}
                    <i>
                      {vietsubWorkingType[teacher.workingType] ||
                        teacher.workingType}
                    </i>{" "}
                    / <i>{teacher.timeType}</i>
                  </span>
                </p>

                <p className="flex items-center gap-2 min-w-0">
                  <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
                  <span
                    className="truncate"
                    title={`${user?.district}, ${user?.province}`}
                  >
                    Khu vực: {user?.district}, {user?.province}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm border rounded bg-gray-50 p-2 w-full">
                Ứng viên chưa cập nhật hồ sơ giáo viên
              </p>
            )}

            {/* Link xem chi tiết */}
            {teacher?._id && (
              <div className="pt-2">
                <Link
                  to={`/giao-vien/${teacher._id}`}
                  className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  👉 Xem chi tiết
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeacherApplications;
