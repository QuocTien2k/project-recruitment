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

const NotifiByAdmin = () => {
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

  //khi click đọc tin
  const handleClickNotification = async (noti) => {
    try {
      if (!noti.isRead) {
        await markNotifiAsRead(noti._id);
        dispatch(markReadNotifiByAdmin(noti._id));
      }

      // Điều hướng nếu có link
      if (noti.post) {
        navigate(`/bai-viet-cua-toi`);
      } else if (noti.blog) {
        navigate(`/blogs/${noti.blog._id}`);
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

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer flex items-center gap-2"
      >
        <span className="text-xl relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-10">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-medium text-sm">Thông báo</span>
            {list.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Đánh dấu tất cả đã đọc
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
                <div
                  onClick={() => handleClickNotification(n)}
                  className="flex justify-between items-start"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">{n.message}</span>
                    <span className="text-xs text-gray-500">
                      {dayjs(n.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-xs text-red-500 hover:underline mt-1"
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotifiByAdmin;
