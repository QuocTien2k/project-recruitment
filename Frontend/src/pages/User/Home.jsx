import ShortListTeacher from "@sections/ShortListTeacher";
import Post from "@sections/Post";
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
