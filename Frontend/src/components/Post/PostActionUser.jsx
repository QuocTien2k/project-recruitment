import React, { useState } from "react";
import Button from "@components-ui/Button";
import EditPost from "@modals/EditPost";
import { useSelector } from "react-redux";
import { showCustomConfirm } from "@components-ui/Confirm";
import toast from "react-hot-toast";
import { deletePost } from "@api/post";

const PostActionUser = ({ post, handleUpdatePost }) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);
  // console.log(currentUser?._id);
  // console.log(post);

  const handleClickDelete = () => {
    if (post.createdBy !== currentUser._id) {
      toast.error("Bạn không có quyền xóa bài viết này.");
      return;
    }

    showCustomConfirm({
      title: "Xác nhận xóa bài viết",
      message: "Bạn có chắc chắn muốn xóa bài viết này không?",
      onConfirm: async () => {
        try {
          const res = await deletePost(post._id);
          toast.success(res.message || "Đã xóa bài viết");
          handleUpdatePost({ ...post, deleted: true });
        } catch (err) {
          const msg = err.response?.data?.message || "Xóa thất bại!";
          toast.error(msg);
        }
      },
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setOpenModalEdit(true)} size="sm">
          Chỉnh sửa
        </Button>
        <Button onClick={handleClickDelete} size="sm" variant="danger">
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
