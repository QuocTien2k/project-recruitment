import React from "react";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaListAlt,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Button from "@components/Button";
import { Link } from "react-router-dom";

const PostCard = ({
  post,
  showOwnerActions = false, // show trạng thái + action chỉ ở MyPost
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onViewDetail,
}) => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const isAdmin = currentUser?.role === "admin";
  const isPostOwner = currentUser?._id === post.createdBy;

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* LEFT: Thông tin bài viết */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {post.description}
          </p>

          <div className="flex flex-col gap-2 mt-4 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" />
              <span>
                {post.district}, {post.province}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" />
              <span>Lương: {post.salary}</span>
            </p>
            <p className="flex items-center gap-2">
              <MdWork className="text-blue-500" />
              <span>Hình thức: {post.workingType}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              <span>Thời gian: {post.timeType}</span>
            </p>
            {/* Luôn hiển thị "Xem chi tiết" ở dưới cùng nếu không phải admin */}
            {!isAdmin && (
              <div className="pt-2 text-center border-t border-gray-100 mt-1">
                <Link
                  to={`/post/${post.slug}`}
                  onClick={onViewDetail}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                  👉 Xem chi tiết
                </Link>
              </div>
            )}
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
                      }`}
                  >
                    {post.status}
                  </span>
                </span>
              </p>
            )}
            {showOwnerActions &&
              post.status === "rejected" &&
              post.rejectionReason && (
                <p className="text-xs text-red-500 italic mt-1 ml-6">
                  Lý do bị từ chối: {post.rejectionReason}
                </p>
              )}
          </div>
        </div>

        {/* Nếu là chủ bài và đang ở MyPost => Hiển thị action ở phía trên nội dung */}
        {isPostOwner && showOwnerActions && (
          <div className="mt-4 text-left">
            <PostActionUser onEdit={onEdit} onDelete={onDelete} />
          </div>
        )}

        {/* Nếu là admin => Hiển thị action admin ở vị trí riêng (tuỳ chọn có thể để trên hoặc dưới) */}
        {isAdmin && (
          <div className="mt-4 text-left">
            <PostActionAdmin
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
