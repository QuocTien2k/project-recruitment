import ShortListTeacher from "@sections/ShortListTeacher";
import ShortListPost from "@sections/ShortListPost";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="space-y-8">
        <ShortListTeacher />

        <ShortListPost />
      </div>
    </>
  );
};

export default Home;
