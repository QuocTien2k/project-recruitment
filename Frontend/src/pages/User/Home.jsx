import ShortListTeacher from "@sections/ShortListTeacher";
import ShortListPost from "@sections/ShortListPost";
import React from "react";
import SliderTeacher from "@sections/SliderTeacher";
import { useSelector } from "react-redux";
import NearbyTeachers from "@sections/NearbyTeachers";
import NearbyPosts from "@sections/NearbyPosts";
import SliderSchool from "@sections/SliderSchool";
import SliderBanner from "@sections/SliderBanner";

const Home = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  //console.log(currentUser);

  return (
    <>
      <main className="py-4 space-y-8">
        <SliderBanner />

        {/* Section 1: Nearby */}
        {currentUser?.role === "user" && <NearbyTeachers />}
        {currentUser?.role === "teacher" && <NearbyPosts />}

        {/* Section 2-3: ShortListTeacher */}
        {/* Grid 12 cột */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left */}
          <div className="xl:col-span-9">
            <ShortListTeacher />
          </div>

          {/* Right */}
          <div className="xl:col-span-3">
            <SliderTeacher />
          </div>
        </div>

        {/* Section 4: ShortListPost */}
        <ShortListPost />

        {/* Section 5: Slider School */}
        <SliderSchool />
      </main>
    </>
  );
};

export default Home;
