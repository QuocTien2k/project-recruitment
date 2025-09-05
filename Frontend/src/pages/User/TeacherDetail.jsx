import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaUserTie,
  FaMapMarkerAlt,
  FaUniversity,
  FaRegClock,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { getTeacherDetail } from "@api/public";
import { useDispatch, useSelector } from "react-redux";
import { setTeacherLoading } from "@redux/loadingSlice";
import Loading from "@components-ui/Loading";
import Button from "@components-ui/Button";
import { useChatContext } from "@context/ChatContext";
import toast from "react-hot-toast";

const TeacherDetail = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const dispatch = useDispatch();
  const isTeacherLoading = useSelector((state) => state.loading.teacher);
  const currentUser = useSelector((state) => state.currentUser.user);
  const { openChat } = useChatContext();

  const avatarDefault =
    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

  const fetchDetail = async () => {
    dispatch(setTeacherLoading(true));
    try {
      const res = await getTeacherDetail(teacherId);
      setTeacher(res?.data);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết giáo viên:", err);
    } finally {
      dispatch(setTeacherLoading(false));
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const {
    userId,
    description,
    experience,
    subject,
    timeType,
    workingType,
    faculty,
  } = teacher || {};
  const fullName = `${userId?.middleName || ""} ${userId?.name || ""}`.trim();

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để trò chuyện!");
      return;
    }

    if (currentUser?._id === userId?.id) {
      toast.error("Không thể trò chuyện với chính mình!");
      return;
    }

    await openChat(userId?._id); // Gọi context xử lý logic tạo hoặc chọn chat
  };

  // useEffect(() => {
  //   console.log("Thông tin của mình: ", currentUser?._id);
  //   console.log("Thông tin của giáo viên: ", userId?._id);
  // }, [userId, currentUser]);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <Link to="/" className="text-sm text-blue-600 hover:underline block mb-4">
        ← Quay lại danh sách
      </Link>

      {isTeacherLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loading size="md" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar + Info */}
          <div className="flex-shrink-0 flex flex-col justify-around items-center gap-y-2 sm:gap-y-4 md:gap-y-6">
            <img
              src={userId?.profilePic?.url || avatarDefault}
              alt={fullName}
              className="w-32 h-32 object-cover rounded-full border"
            />

            <Button size="sm" variant="default" onClick={handleStartChat}>
              💬 Liên hệ
            </Button>
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex-1 space-y-2 text-gray-800">
            <h1 className="text-2xl font-bold">{fullName}</h1>

            <p className="flex items-center gap-2 text-sm text-gray-600">
              <FaEnvelope className="text-blue-500" /> {userId?.email}
            </p>

            <p className="flex items-center gap-2">
              <FaUserTie className="text-indigo-500" /> Môn dạy:
              <span className="font-medium">{subject?.join(", ")}</span>
            </p>

            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <FaUniversity className="text-purple-500" />
              <span>Khoa: {vietsubFaculty[faculty] || faculty}</span>
            </p>

            <p className="flex items-center gap-2">
              <MdWork className="text-green-500 text-lg" /> Kinh nghiệm:
              <span className="font-medium">{experience} năm</span>
            </p>

            <p className="flex items-center gap-2">
              <FaRegClock className="text-yellow-600" />
              <span className="italic">
                Hình thức làm việc:{" "}
                {vietsubWorkingType[workingType] || workingType} / {timeType}
              </span>
            </p>

            <p className="flex items-start gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-red-400 flex-shrink-0 mt-1" />
              <span>
                <span className="font-medium">Khu vực:</span> {userId?.district}
                , {userId?.province}
              </span>
            </p>

            {description && (
              <div className="pt-4">
                <p className="font-semibold text-gray-700">Giới thiệu:</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDetail;
