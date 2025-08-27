import { actionUnBlock } from "@api/block";
import Button from "@components-ui/Button";
import React from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaUserMinus } from "react-icons/fa";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const CardBlock = ({ user, handleUpdateList }) => {
  const fullName = `${user?.blockedUser?.middleName || ""} ${
    user?.blockedUser?.name || ""
  }`.trim();

  //console.log(user);

  const handleUnBlock = async (blockDocId, blockedUserId) => {
    try {
      const res = await actionUnBlock(blockedUserId);
      if (res.success) {
        handleUpdateList(blockDocId); // xóa block khỏi UI
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Mở chặn thất bại");
      console.error(
        "Mở chặn thất bại:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="max-w-[280px] min-h-[220px] relative border rounded-xl shadow-md bg-white p-6 hover:shadow-lg transition duration-300 flex flex-col items-center text-center space-y-5">
      {/* Nút gỡ chặn */}
      <Button
        onClick={() => handleUnBlock(user._id, user.blockedUser._id)}
        variant="danger"
        size="sm"
        className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-md"
      >
        <FaUserMinus />
        Gỡ
      </Button>

      {/* Avatar */}
      <img
        src={user?.blockedUser?.profilePic?.url || avatarDefault}
        alt={fullName || "user-avatar"}
        onError={(e) => (e.target.src = avatarDefault)}
        className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 hover:ring-2 hover:ring-blue-400 transition"
      />

      {/* Thông tin */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
        <p className="flex items-center gap-2 justify-center text-gray-600">
          <FaEnvelope className="text-blue-500" />
          <span
            className="truncate max-w-[200px]"
            title={user?.blockedUser?.email}
          >
            {user?.blockedUser?.email}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CardBlock;
