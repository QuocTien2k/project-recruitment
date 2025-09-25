import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; //hiển thị tiếng Việt
import { useNavigate } from "react-router-dom";
import {
  deleteNotifi,
  getAllNotifi,
  markAllNotifiAsRead,
  markNotifiAsRead,
} from "@api/notifiByAdmin";
import {
  deleteNotifiByAdmin,
  markAllReadNotifiByAdmin,
  markReadNotifiByAdmin,
  setNotifiByAdmin,
} from "@redux/notifiByAdminSlice";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotificationBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list } = useSelector((state) => state.notifiByAdmin);

  // Load thông báo lần đầu
  useEffect(() => {
    const fetchNotifi = async () => {
      try {
        const data = await getAllNotifi();
        dispatch(setNotifiByAdmin(data));
      } catch (err) {
        console.error("Lỗi lấy thông báo:", err);
      }
    };
    fetchNotifi();
  }, [dispatch]);

  const unreadCount = list.filter((n) => !n.isRead).length;

  // Trigger animation dựa vào unreadCount và dropdown
  const isShaking = unreadCount > 0 && !isDropdownOpen;

  //khi click đọc tin
  const handleClickNotification = async (noti) => {
    //console.log("noti nhận được:", noti);
    //console.log("link:", noti.link);

    try {
      if (!noti.isRead) {
        await markNotifiAsRead(noti._id);
        dispatch(markReadNotifiByAdmin(noti._id));
      }

      // Điều hướng theo type
      switch (noti.type) {
        case "APPLICATION_PENDING":
          navigate(noti.link);
          break;

        case "POST_APPROVED":
        case "POST_REJECTED":
          navigate(`/bai-viet-cua-toi`);
          break;
        case "APPLICATION_ACCEPTED":
        case "APPLICATION_REJECTED":
          navigate(noti.link, { state: { refresh: true } });
          break;
        default:
          if (noti.link) navigate(noti.link, { state: { refresh: true } });
          break;
      }

      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Lỗi khi mark read:", err);
    }
  };

  //xóa tin
  const handleDelete = async (id) => {
    try {
      await deleteNotifi(id);
      dispatch(deleteNotifiByAdmin(id));
    } catch (err) {
      console.error("Lỗi khi xóa thông báo:", err);
    }
  };

  //đánh dấu đọc tất cả tin
  const handleMarkAllRead = async () => {
    try {
      await markAllNotifiAsRead();
      dispatch(markAllReadNotifiByAdmin());
    } catch (err) {
      console.error("Lỗi mark all read:", err);
    }
  };

  //xử lý văn bản dài
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer flex items-center gap-2"
      >
        <span className="text-xl relative">
          <Bell size={20} className={isShaking ? "animate-shake-bell" : ""} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-0.5">
              {unreadCount}
            </span>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          className="
    absolute mt-2 w-72 sm:w-80 md:max-w-lg 
    max-w-[calc(100vw-20px)] bg-white shadow-lg rounded-lg 
    min-h-[100px] max-h-96 overflow-y-auto z-50
    
    left-1/2 -translate-x-[65%]   /* mobile: căn giữa màn hình */
    sm:left-auto sm:right-0 sm:translate-x-0  /* từ sm trở lên: bám chuông */
  "
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2 border-b">
            <span className="w-[180px] font-medium text-[13px] text-gray-700">
              Thông báo
            </span>
            {list.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[13px] text-blue-500 hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Không có thông báo
            </div>
          ) : (
            list.map((n) => (
              <div
                key={n._id}
                className={`px-4 py-3 border-b last:border-none cursor-pointer hover:bg-gray-50 ${
                  !n.isRead ? "bg-gray-50 font-medium" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  {/* Message + Status */}
                  <div
                    onClick={() => handleClickNotification(n)}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="block text-sm text-gray-800 break-words">
                      {truncateText(n?.message, 70)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {dayjs(n.createdAt).fromNow()}
                    </div>
                  </div>

                  {/* Nút Xóa */}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="mt-1 sm:mt-0 cursor-pointer text-xs text-red-500 hover:underline shrink-0"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
