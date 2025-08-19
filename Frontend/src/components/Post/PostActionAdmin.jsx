import React from "react";
import Button from "@/components/UI/Button";

const PostActionAdmin = ({ onApprove, onReject, onDelete }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onApprove}>Duyệt bài</Button>
      <Button onClick={onReject} variant="reject">
        Từ chối
      </Button>
      <Button onClick={onDelete} variant="danger">
        Xóa
      </Button>
    </div>
  );
};

export default PostActionAdmin;
