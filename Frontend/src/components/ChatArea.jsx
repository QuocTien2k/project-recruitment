import {
  clearUnreadMessageCount,
  createNewMessage,
  getMessages,
} from "@/apiCalls/message";
import { getUserById } from "@/apiCalls/user";
import { setAllChats, setSelectedChat } from "@/redux/currentUserSlice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ChatArea = () => {
  const [receiverInfo, setReceiverInfo] = useState(null);
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.currentUser
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!selectedChat || !user) return;

      const receiver = selectedChat.members.find((m) =>
        typeof m === "string" ? m !== user._id : m._id !== user._id
      );

      const receiverId =
        typeof receiver === "string" ? receiver : receiver?._id;
      if (!receiverId) return;

      try {
        const res = await getUserById(receiverId);
        setReceiverInfo(res);
      } catch (err) {
        console.error("Không thể lấy thông tin người nhận:", err.message);
      }
    };

    fetchReceiver();
  }, [selectedChat, user]);

  // useEffect(() => {
  //   if (!selectedChat || !user || !selectedChat.members) return;

  //   const receiverId = selectedChat.members.find((m) => m !== user._id);

  //   //console.log("Người dùng hiện tại: ", user._id);
  //   //console.log("Danh sách thành viên: ", selectedChat.members);
  //   //console.log("Người nhận ID: ", receiverId);
  // }, [selectedChat, user]);

  //console.log("Thông tin người nhận: ", receiverInfo?.data);
  const fullName = `${receiverInfo?.data?.middleName || ""} ${
    receiverInfo?.data?.name || ""
  }`.trim();

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      };

      const res = await createNewMessage(newMessage);
      if (res?.success) {
        setMessages((prev) => [...prev, res.data]);
        setMessage("");
      }
    } catch (err) {
      console.log("Lỗi gửi tin: ", err);
      toast.error("Không thể gửi tin nhắn!");
    }
  };

  // Lấy tin nhắn
  const fetchMessages = async () => {
    try {
      const res = await getMessages(selectedChat._id);
      if (res?.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.log("Lỗi lấy tin: ", err);
      toast.error("Không thể lấy tin nhắn!");
    }
  };

  // Clear tin chưa đọc
  const clearUnread = async () => {
    try {
      const res = await clearUnreadMessageCount(selectedChat._id);
      if (res?.success) {
        const updatedChats = allChats.map((chat) =>
          chat._id === selectedChat._id ? res.data : chat
        );
        dispatch(setAllChats(updatedChats));
      }
    } catch (err) {
      console.error("Lỗi xóa tin chưa đọc", err);
    }
  };

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
      clearUnread();
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) return null;

  //console.log("Tin nhắn: ", messages);

  return (
    <div className="fixed bottom-4 right-4 w-[320px] sm:w-[360px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-t-md">
        <span>💬 {fullName || "Người dùng"}</span>
        <button
          onClick={() => dispatch(setSelectedChat(null))}
          className="text-sm text-red-200 hover:text-white"
        >
          Đóng
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((msg) => {
          const isSender = msg.sender?._id === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${
                  isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
                <div className="text-[10px] mt-1 opacity-70 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-2 border rounded text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`px-3 py-2 text-sm rounded ${
            !message.trim()
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
