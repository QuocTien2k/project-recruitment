import React from "react";
import Button from "@components/Button";

const PostActionAdmin = ({ onApprove, onReject, onDelete }) => {
  return (
    <>
      <Button onClick={onApprove}>Duyệt bài</Button>
      <Button onClick={onReject} variant="ghost">
        Từ chối
      </Button>
      <Button onClick={onDelete} variant="danger">
        Xóa
      </Button>
    </>
  );
};

export default PostActionAdmin;
