import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const currentUser = useSelector((state) => state.currentUser.user);

  console.log("Thông tin user hiện tại: ", currentUser);
  return <div>{currentUser.email}</div>;
};

export default Header;
