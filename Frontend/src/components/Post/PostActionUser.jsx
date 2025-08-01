import React from "react";
import Button from "@components/Button";

const PostActionUser = ({ onEdit, onDelete }) => {
  return (
    <>
      <Button onClick={onEdit}>Chỉnh sửa</Button>
      <Button onClick={onDelete} variant="danger">
        Xóa
      </Button>
    </>
  );
};

export default PostActionUser;
