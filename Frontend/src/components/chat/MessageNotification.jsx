import { ChatContext } from "@/context/ChatContext";
import { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MdBlock } from "react-icons/md";
import { MessageCircle } from "lucide-react";

const MessageNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { allChats, user } = useSelector((state) => state.currentUser);
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
          {hasNewMessages ? "Tin nhắn mới" : "Không có tin nhắn mới"}
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
            usersWithMessages.map((u) => {
              const isLocked = u.isActive === false;

              return (
                <div
                  key={u._id}
                  className={`px-4 py-3 border-b last:border-none ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                  onClick={() => handleClick(u)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-medium text-sm text-gray-800 ${
                            isLocked ? "line-through text-gray-500" : ""
                          }`}
                          title={`${isLocked ? "Tài khoản bị khóa" : ""}`}
                        >
                          {`${u.middleName || ""} ${u.name || ""}`}
                        </span>
                        {isLocked && <MdBlock className="text-red-500" />}
                      </div>
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {getLastMessage(u._id, u.name || "") ||
                          "Chưa có tin nhắn"}
                      </span>
                    </div>

                    {getUnreadMessageCount(u._id) > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2 h-fit">
                        {getUnreadMessageCount(u._id)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
