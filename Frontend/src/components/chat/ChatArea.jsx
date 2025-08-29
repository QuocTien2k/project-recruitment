import { actionBlock, getBlockStatus } from "@api/block";
import {
  clearUnreadMessageCount,
  createNewMessage,
  getMessages,
} from "@api/message";
import { getUserById } from "@api/user";
import { ChatContext } from "@context/ChatContext";
import { setAllChats, setSelectedChat } from "@redux/currentUserSlice";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ADMIN_ID = "68946f57455a4c49bda694ed";

const ChatArea = () => {
  const [receiverInfo, setReceiverInfo] = useState(null);
  const dispatch = useDispatch();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockChecked, setBlockChecked] = useState(false);
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.currentUser
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const { socket } = useContext(ChatContext);

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

  console.log("Thông tin người nhận đã cập nhật:", receiverInfo?.data);

  const fullName = `${receiverInfo?.data?.middleName || ""} ${
    receiverInfo?.data?.name || ""
  }`.trim();

  const avatarReceiver = receiverInfo?.data?.profilePic?.url;

  //tính năng chặn
  const handleBlock = async () => {
    if (!receiverInfo?.data?._id) return;

    try {
      const res = await actionBlock(receiverInfo.data._id);
      if (res?.success) {
        toast.success(res.message || "Chặn thành công!");
        setIsBlocked(true);
      } else {
        toast.error(res.message || "Chặn thất bại!");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Có lỗi khi chặn người dùng!"
      );
      console.error(err);
    }
  };

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim()) return;

    // Nếu tài khoản người nhận đã bị khóa thì không gửi
    if (!receiverInfo?.data?.isActive) {
      toast.error("Không thể gửi tin nhắn. Tài khoản người nhận đã bị khóa.");
      return;
    }

    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      };

      const res = await createNewMessage(newMessage);

      if (res?.success) {
        setMessage(""); // clear input

        // Gửi tin qua socket để cả 2 bên nhận được
        const msgData = {
          ...res.data,
          members: selectedChat.members.map((m) =>
            typeof m === "string" ? m : m._id
          ),
        };

        // 👇 Gửi qua socket để người nhận nhận được
        socket.emit("send-message", msgData);

        // 👇 Tự thêm vào danh sách hiển thị
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.log("Lỗi gửi tin: ", err);
      toast.error(err?.response?.data?.message || "Không thể gửi tin nhắn!");
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
        socket.emit("clear-unread-messages", {
          members: selectedChat.members.map((m) =>
            typeof m === "string" ? m : m._id
          ),
          chatId: selectedChat._id,
        });

        dispatch(setAllChats(updatedChats));
      }
    } catch (err) {
      console.error("Lỗi xóa tin chưa đọc", err);
    }
  };

  //kiểm tra trạng thái block trước khi gọi ChatArea
  const checkBlockStatus = async () => {
    try {
      const res = await getBlockStatus(receiverInfo?.data?._id);
      if (res?.success) {
        setIsBlocked(res.isBlocked);
      }
    } catch (err) {
      console.error("Không thể kiểm tra trạng thái block:", err);
      setIsBlocked(false);
    } finally {
      setBlockChecked(true);
    }
  };

  //kiểm tra trạng thái block khi mount
  useEffect(() => {
    if (!receiverInfo?.data?._id) return;

    if (receiverInfo?.data?._id === ADMIN_ID) {
      setIsBlocked(false); // không thể chặn admin
      setBlockChecked(true); // luôn mở chat với admin
      return;
    }

    checkBlockStatus();
  }, [receiverInfo]);

  //nhận tin
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleReceiveMessage = (newMsg) => {
      const isInCurrentChat = newMsg.chatId === selectedChat._id;
      if (isInCurrentChat) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
      clearUnread();
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || !selectedChat) return null;

  //console.log("Tin nhắn: ", messages);

  return (
    <div className="fixed bottom-4 right-4 w-[320px] sm:w-[360px] h-[450px] bg-white rounded-xl shadow-xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold overflow-hidden">
            {avatarReceiver ? (
              <img
                src={avatarReceiver}
                alt={fullName || "U"}
                className="w-full h-full object-cover"
              />
            ) : fullName ? (
              fullName[0]
            ) : (
              "U"
            )}
          </div>
          <span className="font-semibold">{fullName || "Người dùng"}</span>
        </div>
        <div className="flex gap-3 text-sm">
          {!isBlocked && receiverInfo?.data?._id !== ADMIN_ID && (
            <button
              onClick={handleBlock}
              className="hover:text-yellow-200 cursor-pointer transition-colors"
            >
              Chặn
            </button>
          )}
          <button
            onClick={() => dispatch(setSelectedChat(null))}
            className="hover:text-red-600 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((msg) => {
          const isSender = msg.sender?._id === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm break-words shadow ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.text}
                <div className="text-[10px] mt-1 opacity-60 text-right">
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
      <div className="p-3 border-t bg-white">
        {!blockChecked ? (
          <p className="text-sm text-gray-500">Đang kiểm tra trạng thái...</p>
        ) : isBlocked ? (
          <p className="text-sm text-red-500">Bạn đã chặn người này</p>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <textarea
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Aa"
              className="flex-1 min-w-0 resize-none rounded-full px-4 py-2 text-sm bg-gray-100 focus:outline-none max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`w-16 !w-auto flex-shrink-0 p-2 rounded-full transition-colors ${
                !message.trim()
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:bg-blue-100"
              }`}
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
