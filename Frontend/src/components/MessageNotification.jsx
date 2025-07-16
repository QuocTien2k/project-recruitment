import { useState } from "react";

const MessageNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // TODO: Đặt dữ liệu users có tin nhắn
  const usersWithMessages = []; // Placeholder
  const getUnreadMessageCount = (userId) => 0; // Placeholder
  const getLastMessage = (userId, name) => ""; // Placeholder
  const handleClick = (userId) => {}; // Placeholder

  const hasNewMessages = usersWithMessages.some(
    (user) => getUnreadMessageCount(user._id) > 0
  );

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
          💬
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
            usersWithMessages.map((user) => (
              <div
                key={user._id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                onClick={() => handleClick(user._id)}
              >
                <div className="flex justify-between items-start">
                  {/* Tên + tin nhắn cuối */}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-800">
                      {user.lastname}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">
                      {getLastMessage(user._id, user.lastname) ||
                        "Chưa có tin nhắn"}
                    </span>
                  </div>

                  {/* Badge số chưa đọc */}
                  {getUnreadMessageCount(user._id) > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2 h-fit">
                      {getUnreadMessageCount(user._id)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
