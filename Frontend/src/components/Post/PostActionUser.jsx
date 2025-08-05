import React, { useState } from "react";
import Button from "@components/Button";
import EditPost from "@/Modals/EditPost";

const PostActionUser = ({ post, handleUpdatePost }) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setOpenModalEdit(true)} size="sm">
          Chỉnh sửa
        </Button>
        <Button onClick={() => console.log("")} size="sm" variant="danger">
          Xóa
        </Button>
      </div>
      {openModalEdit && (
        <EditPost
          post={post}
          onClose={() => setOpenModalEdit(false)}
          handleUpdatePost={handleUpdatePost}
        />
      )}
    </>
  );
};

export default PostActionUser;
