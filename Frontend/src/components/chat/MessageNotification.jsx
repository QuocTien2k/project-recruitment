import { ChatContext } from "@context/ChatContext";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MdBlock } from "react-icons/md";
import { MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const MessageNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { allChats, user, __debugBump } = useSelector(
    (state) => state.currentUser
  );

  // useEffect(() => {
  //   console.log("[MN] __debugBump =", __debugBump);
  // }, [__debugBump]);

  const { openChat, getLastMessage, getUnreadMessageCount } =
    useContext(ChatContext);

  //console.log("Dữ liệu allChat: ", allChats);

  // Lấy danh sách các user từng chat (trừ chính mình)
  const usersWithMessages = useMemo(() => {
    if (!Array.isArray(allChats)) return [];

    const users = [];

    allChats.forEach((chat) => {
      chat?.members.forEach((member) => {
        if (
          member?._id !== user._id &&
          !users.some((u) => u._id === member._id)
        ) {
          users.push(member);
        }
      });
    });

    return users;
  }, [allChats, user]);

  // 👉 Khi click vào người dùng
  const handleClick = (selectedUserId) => {
    if (!selectedUserId.isActive) return;
    openChat(selectedUserId);
    setIsDropdownOpen(false);
  };

  const hasNewMessages =
    Array.isArray(usersWithMessages) &&
    usersWithMessages.some((user) => getUnreadMessageCount(user._id) > 0);

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer flex items-center gap-2"
      >
        <span
          className={`text-xl ${hasNewMessages ? "animate-pulse-ring" : ""}`}
        >
          <MessageCircle size={20} />
        </span>
        <span
          className={`text-sm ${
            hasNewMessages ? "text-red-500" : "text-gray-500"
          } hidden sm:inline`}
        >
          {hasNewMessages ? "Tin nhắn mới" : ""}
        </span>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-10 animate-fade-down">
          {usersWithMessages.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Không có cuộc trò chuyện nào
            </div>
          ) : (
            <>
              {usersWithMessages.map((u) => {
                const isLocked = u.isActive === false;
                const lastMsg = getLastMessage(u._id, u.name || "");
                const unreadCount = getUnreadMessageCount(u._id);

                // tìm chat ứng với user
                const chat = allChats.find((c) =>
                  c.members.map((m) => m._id).includes(u._id)
                );

                return (
                  <div
                    key={u._id}
                    className={`px-4 py-3 border-b last:border-none 
        ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-gray-50 cursor-pointer"
        }
        ${unreadCount > 0 ? "bg-blue-50" : ""}
      `}
                    onClick={() => handleClick(u)}
                  >
                    <div className="flex justify-between items-start">
                      {/* Bên trái: tên + tin nhắn */}
                      <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-medium text-sm text-gray-800 truncate max-w-[150px] ${
                              isLocked ? "line-through text-gray-500" : ""
                            }`}
                            title={isLocked ? "Tài khoản bị khóa" : ""}
                          >
                            {`${u.middleName || ""} ${u.name || ""}`}
                          </span>
                          {isLocked && (
                            <MdBlock className="text-red-500 text-xs" />
                          )}
                        </div>

                        <span className="text-xs text-gray-500 truncate max-w-[180px]">
                          {lastMsg || "Chưa có tin nhắn"}
                        </span>
                      </div>

                      {/* Bên phải: thời gian + badge */}
                      <div className="flex flex-col items-end ml-2 shrink-0">
                        <span className="text-[10px] text-gray-400 mb-1">
                          {chat?.lastMessage?.createdAt
                            ? dayjs(chat.lastMessage.createdAt).fromNow()
                            : ""}
                        </span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
