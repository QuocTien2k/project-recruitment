import { useChatContext } from "@/context/ChatContext";
import { useSelector } from "react-redux";
import { MessageCircle } from "lucide-react"; // icon chat
import toast from "react-hot-toast";

export default function ContactAdminButton() {
  const { openChat } = useChatContext();
  const currentUser = useSelector((state) => state.currentUser.user);

  // ID admin trong MongoDB
  const ADMIN_ID = "68946f57455a4c49bda694ed";

  const handleClick = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để trò chuyện!");
      return;
    }
    openChat(ADMIN_ID);
  };

  if (currentUser && currentUser._id === ADMIN_ID) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="ping-effect cursor-pointer fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50"
        title="Liên hệ Admin"
      >
        <MessageCircle size={18} />
      </button>
    </>
  );
}
