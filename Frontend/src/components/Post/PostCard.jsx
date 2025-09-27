import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaListAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { getPostViews } from "@api/viewer";
import {
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  FileText,
  User,
  Hash,
  AlertCircle,
} from "lucide-react";
import RejectPost from "@modals/RejectPost";
import Button from "@components-ui/Button";
import toast from "react-hot-toast";
import PostActionUser from "./PostActionUser";
import PostActionAdmin from "./PostActionAdmin";
import { FiEdit } from "react-icons/fi";

const PostCard = ({
  post,
  showOwnerActions = false,
  onApprove,
  onReject,
  onDelete,
  onViewDetail,
  showFullDescription = false,
  handleUpdatePost,
  handleCreateContractWithPost,
  creatingContract,
}) => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const [showFullReason, setShowFullReason] = useState(false);
  const isAdmin = currentUser?.role === "admin";
  const isPostOwner = currentUser?._id === post.createdBy;
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (post?._id) {
      getPostViews(post._id).then((res) => {
        if (res.success) {
          setViews(res.data.totalViews);
        }
      });
    }
  }, [post?._id]);

  const handleCopyId = () => {
    navigator.clipboard
      .writeText(post?.createdBy)
      .then(() => {
        toast.success("Đã copy ID!");
      })
      .catch(() => {
        toast.error("Copy thất bại!");
      });
  };

  //console.log(post);

  const formatted = dayjs(post?.createdAt).format("DD/MM/YYYY");

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Post actions (User hoặc Admin) */}
      <div className="w-full flex justify-center mb-2">
        {isPostOwner && showOwnerActions && (
          <PostActionUser post={post} handleUpdatePost={handleUpdatePost} />
        )}
        {isAdmin && (
          <>
            {post?.status === "pending" ? (
              <PostActionAdmin
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
              />
            ) : (
              <div className="flex justify-center">
                <Button onClick={onDelete} variant="danger">
                  Xóa
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tiêu đề */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {post?.title}
      </h2>

      {/* Nội dung tuyển dụng (Mô tả) */}
      {showFullDescription && (
        <div className="flex gap-2 text-gray-700 mb-3">
          <FileText className="text-purple-500 flex-shrink-0 mt-0.5 w-4 h-4" />
          <div className="flex flex-col">
            <p className="font-semibold text-sm mb-1">Nội dung tuyển dụng:</p>
            <p className="scrollable-text text-sm text-gray-600 whitespace-pre-line">
              {post?.description}
            </p>
          </div>
        </div>
      )}

      {/* Nội dung chi tiết */}
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        {/*Địa điểm */}
        <p className="flex items-center gap-2">
          <MapPin className="text-red-500 w-4 h-4" />
          <span>
            {post?.district}, {post?.province}
          </span>
        </p>

        {/*Lương */}
        <p className="flex items-center gap-2">
          <DollarSign className="text-green-500 w-4 h-4" />
          <strong>Mức lương:</strong>
          <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
            {post?.salary}
          </strong>
        </p>

        {/*hình thức làm việc */}
        <p className="flex items-center gap-2">
          <Briefcase className="text-blue-500 w-4 h-4" />
          <span>Hình thức: {post?.workingType}</span>
        </p>

        {/*Thời gian làm việc */}
        <p className="flex items-center gap-2">
          <Clock className="text-yellow-500 w-4 h-4" />
          <span>Thời gian: {post?.timeType}</span>
        </p>

        {/*Lượt xem */}
        <p className="flex items-center gap-2 mt-2 text-gray-600">
          <Eye className="text-indigo-500 w-4 h-4" />
          <span>{views} lượt xem</span>
        </p>

        {/*Ngày tạo */}
        <p className="flex items-center gap-2 mt-1 text-gray-600">
          <CalendarDays className="text-emerald-500 w-4 h-4" />
          <span>Ngày tạo: {formatted}</span>
        </p>

        {isAdmin && (
          <div className="flex items-center gap-4 mt-1 text-gray-600">
            <span className="flex items-center gap-1">
              <User className="text-blue-500 w-4 h-4" />
              {post?.createdByName}
            </span>
            <span
              onClick={handleCopyId}
              title="Click để copy ID"
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors"
            >
              <Hash className="text-gray-500 w-4 h-4" />
              {post?.createdBy}
            </span>
          </div>
        )}

        {/* Trạng thái */}
        {showOwnerActions && post?.status && (
          <p className="flex items-center gap-2">
            <FaListAlt className="text-purple-500" />
            <span>
              Trạng thái:
              <span
                className={`ml-1 px-2 py-0.5 rounded-md text-xs font-semibold
                  ${
                    post?.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : post?.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >
                {post?.status === "approved"
                  ? "Đã duyệt"
                  : post?.status === "pending"
                  ? "Đang chờ duyệt"
                  : "Đã từ chối"}
              </span>
            </span>
          </p>
        )}

        {/* Lý do từ chối */}
        {showOwnerActions &&
          post?.status === "rejected" &&
          post?.rejectionReason && (
            <div
              className="flex gap-2 text-red-600 mb-3 cursor-pointer"
              onClick={() => setShowFullReason(true)}
            >
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5 w-4 h-4" />
              <p className="font-semibold text-sm text-blink">
                Bài viết này đã bị từ chối — Xem lý do
              </p>
            </div>
          )}
        {showFullReason && (
          <RejectPost
            reason={post?.rejectionReason}
            onClose={() => setShowFullReason(false)}
          />
        )}
      </div>

      {/* Xem chi tiết nếu không hiển thị toàn bộ mô tả */}
      {!showFullDescription && !isAdmin && (
        <div className="pt-2 text-center border-t border-gray-100 mt-4">
          <Link
            to={`/bai-viet/${post?.slug}`}
            onClick={onViewDetail}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            👉 Xem chi tiết
          </Link>
        </div>
      )}
      {/* Nút tạo hợp đồng từ bài viết (Case 2) */}
      {isPostOwner && post?.status === "approved" && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => handleCreateContractWithPost(post._id)}
            className="flex items-center justify-center gap-2"
            disabled={creatingContract}
          >
            <FiEdit className="w-4 h-4" />
            {creatingContract ? "Đang tạo..." : "Tạo hợp đồng từ bài viết này"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
