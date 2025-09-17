import ShortListTeacher from "@sections/ShortListTeacher";
import ShortListPost from "@sections/ShortListPost";
import React from "react";
import SliderTeacher from "@sections/SliderTeacher";

const Home = () => {
  return (
    <>
      <main className="space-y-16 py-8">
        <SliderTeacher />

        <ShortListTeacher />

        <ShortListPost />
      </main>
    </>
  );
};

export default Home;
