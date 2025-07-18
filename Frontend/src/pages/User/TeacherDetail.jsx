import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEnvelope, FaUserTie, FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { getTeacherDetail } from "@/apiCalls/public";
import { useDispatch, useSelector } from "react-redux";
import { setTeacherLoading } from "@/redux/loadingSlice";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
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

  const { userId, description, experience, subject, timeType, workingType } =
    teacher || {};
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
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <Link to="/" className="text-sm text-blue-600 hover:underline block mb-4">
        ← Quay lại danh sách
      </Link>

      {isTeacherLoading ? (
        <Loading size="md" />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar + Info */}
          <div className="flex-shrink-0 flex flex-col justify-around items-center">
            <img
              src={userId?.profilePic || avatarDefault}
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
              <FaEnvelope className="text-gray-400" /> {userId?.email}
            </p>

            <p className="flex items-center gap-2">
              <FaUserTie className="text-gray-500" /> Môn dạy:
              <span className="font-medium">{subject?.join(", ")}</span>
            </p>

            <p className="flex items-center gap-2">
              <MdWork className="text-gray-500" /> Kinh nghiệm:
              <span className="font-medium">{experience} năm</span>
            </p>

            <p className="flex items-center gap-2">
              🕒 Hình thức làm việc:
              <span className="italic">
                {workingType || "N/A"} - {timeType}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" />
              Khu vực:
              <span>
                {userId?.district}, {userId?.province}
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
