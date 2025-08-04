import React from "react";
import Button from "@components/Button";

const PostActionUser = ({ onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onEdit} size="sm">
        Chỉnh sửa
      </Button>
      <Button onClick={onDelete} size="sm" variant="danger">
        Xóa
      </Button>
    </div>
  );
};

export default PostActionUser;
