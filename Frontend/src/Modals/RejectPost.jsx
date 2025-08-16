import { X } from "lucide-react";

const RejectPost = ({ reason, onClose }) => {
  return (
    <div className="bg-modal">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-red-600">
            Lý do bài viết bị từ chối
          </h2>
          {/* nút close */}
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          >
            <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>
        <div className="text-gray-700 whitespace-pre-line border border-red-200 rounded-md bg-red-50 p-3 text-sm max-h-60 overflow-y-auto">
          {reason}
        </div>
      </div>
    </div>
  );
};

export default RejectPost;
