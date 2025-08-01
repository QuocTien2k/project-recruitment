import React from "react";
import { useSelector } from "react-redux";
import Button from "@components/Button";
const PostCard = ({
  post,
  showOwnerActions = false,
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
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-1">{post.description}</p>
      <p className="text-sm text-gray-500">
        {post.district}, {post.province} • {post.salary}
      </p>
      <p className="text-sm text-gray-500 capitalize">
        {post.workingType} • {post.timeType}
      </p>
      <p className="text-sm text-gray-400 italic mt-1">
        Trạng thái: {post.status}
        {post.status === "rejected" && post.rejectionReason && (
          <span className="text-red-500 ml-2">
            (Lý do: {post.rejectionReason})
          </span>
        )}
      </p>

      <div className="mt-4 flex gap-2 flex-wrap">
        {isAdmin ? (
          <PostActionAdmin
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        ) : isPostOwner && showOwnerActions ? (
          <PostActionUser onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <Button onClick={onViewDetail}>Xem chi tiết</Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
