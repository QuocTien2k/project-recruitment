import React, { useState } from "react";
import { useSelector } from "react-redux";

const EditBlog = ({ blog, onClose, onChangeList }) => {
  const isLoading = useSelector((state) => state.loading.user);
  const [formData, setFormData] = useState({
    title: blog.title || "",
    desc1: blog.desc1 || "",
    desc2: blog.desc2 || "",
    blogPic: blog.blogPic || null,
  });

  return <div>EditBlog</div>;
};

export default EditBlog;
