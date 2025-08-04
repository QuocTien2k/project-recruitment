import React from "react";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaListAlt,
  FaRegFileAlt,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Button from "@components/Button";
import { Link } from "react-router-dom";
import PostActionUser from "./PostActionUser";
import PostActionAdmin from "./PostActionAdmin";

const PostCard = ({
  post,
  showOwnerActions = false,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onViewDetail,
  showFullDescription = false,
}) => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const isAdmin = currentUser?.role === "admin";
  const isPostOwner = currentUser?._id === post.createdBy;

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Post actions (User hoặc Admin) */}
      <div className="flex justify-end mb-2">
        {isPostOwner && showOwnerActions && (
          <PostActionUser onEdit={onEdit} onDelete={onDelete} />
        )}
        {isAdmin && (
          <PostActionAdmin
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        )}
      </div>

      {/* Tiêu đề */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>

      {/* Nội dung tuyển dụng (Mô tả) */}
      {showFullDescription && (
        <div className="flex items-start gap-2 text-gray-700 mb-3">
          <FaRegFileAlt className="text-blue-500 mt-1" />
          <div>
            <p className="font-semibold text-sm mb-1">Nội dung tuyển dụng:</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {post.description}
            </p>
          </div>
        </div>
      )}

      {/* Nội dung chi tiết */}
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-400" />
          <span>
            {post.district}, {post.province}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" />
          <strong>Mức lương:</strong>
          <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
            {post.salary}
          </strong>
        </p>

        <p className="flex items-center gap-2">
          <MdWork className="text-blue-500" />
          <span>Hình thức: {post.workingType}</span>
        </p>

        <p className="flex items-center gap-2">
          <FaClock className="text-yellow-500" />
          <span>Thời gian: {post.timeType}</span>
        </p>

        {/* Trạng thái */}
        {showOwnerActions && post.status && (
          <p className="flex items-center gap-2">
            <FaListAlt className="text-purple-500" />
            <span>
              Trạng thái:
              <span
                className={`ml-1 px-2 py-0.5 rounded-md text-xs font-semibold
                  ${
                    post.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : post.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >
                {post.status === "approved"
                  ? "Đã duyệt"
                  : post.status === "pending"
                  ? "Đang chờ duyệt"
                  : "Đã từ chối"}
              </span>
            </span>
          </p>
        )}

        {/* Lý do từ chối */}
        {showOwnerActions &&
          post.status === "rejected" &&
          post.rejectionReason && (
            <p className="text-xs text-red-500 italic mt-1 ml-6">
              Lý do bị từ chối: {post.rejectionReason}
            </p>
          )}
      </div>

      {/* Xem chi tiết nếu không hiển thị toàn bộ mô tả */}
      {!showFullDescription && !isAdmin && (
        <div className="pt-2 text-center border-t border-gray-100 mt-4">
          <Link
            to={`/bai-viet/${post.slug}`}
            onClick={onViewDetail}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            👉 Xem chi tiết
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostCard;
