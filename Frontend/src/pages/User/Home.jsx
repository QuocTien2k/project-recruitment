import ShortListTeacher from "@/section/ShortListTeacher";
import Post from "@/section/Post";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="space-y-8">
        <ShortListTeacher />

        <Post />
      </div>
    </>
  );
};

export default Home;
