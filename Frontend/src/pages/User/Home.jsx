import ShortListTeacher from "@sections/ShortListTeacher";
import ShortListPost from "@sections/ShortListPost";
import React from "react";
import SliderTeacher from "@sections/SliderTeacher";

const Home = () => {
  return (
    <>
      <main className="py-8">
        {/* Grid 12 cột */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left */}
          <div className="xl:col-span-9">
            <ShortListTeacher />
          </div>

          {/* Right */}
          <div className="xl:col-span-3">
            <SliderTeacher />
          </div>
        </div>

        {/* Section 3: ShortListPost */}
        <div className="mt-16">
          <ShortListPost />
        </div>
      </main>
    </>
  );
};

export default Home;
