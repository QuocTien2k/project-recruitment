import { getListTeacherNearBy } from "@api/user";
import CardTeacher from "@components-cards/CardTeacher";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import { setGlobalLoading } from "@redux/loadingSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

const NearbyTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [slidesToShow, setSlidesToShow] = useState(4);

  const fetchTeachers = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getListTeacherNearBy();

      if (res?.success) {
        setTeachers(res?.data);
      }
    } catch (err) {
      console.error("Lỗi: ", err);
      const msg = err.response?.data?.message || "Có lỗi khi lấy dữ liệu!";
      toast.error(msg);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setSlidesToShow(1);
      else if (window.innerWidth <= 769) setSlidesToShow(2);
      else if (window.innerWidth <= 1025) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    handleResize(); // chạy 1 lần khi load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Custom Previous Arrow
  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="cursor-pointer group absolute left-0 top-1/2 -translate-y-1/2 z-10 
                 bg-white hover:bg-blue-500 rounded-full p-3 
                 shadow-lg hover:shadow-xl transition-all duration-300
                 border border-gray-200 "
      aria-label="Previous"
    >
      <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
    </button>
  );

  // ✅ Custom Next Arrow
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="cursor-pointer group absolute right-0 top-1/2 -translate-y-1/2 z-10 
                 bg-white hover:bg-blue-500 rounded-full p-3 
                 shadow-lg hover:shadow-xl transition-all duration-300
                 border border-gray-200 "
      aria-label="Next"
    >
      <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
    </button>
  );

  // cấu hình slider
  const settings = {
    prevArrow: <PrevArrow />, // ✅ Custom arrow
    nextArrow: <NextArrow />, // ✅ Custom arrow
    dots: false, // ẩn chấm tròn điều hướng
    infinite: false, // lặp vô hạn
    speed: 1500, // tốc độ chuyển (ms)
    slidesToShow, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần
    autoplay: true, // bật auto chạy
  };
  //console.log(teachers);

  return (
    <>
      <section
        className="py-10 px-2 my-2 rounded-2xl"
        style={{
          background: "var(--bg-section-5)",
          boxShadow: "var(--section-shadow)",
        }}
      >
        <div className="max-w-[var(--width-8xl)] mx-auto my-2 px-2 space-y-4">
          {/* 📌 Tiêu đề */}
          <Title text="Giáo viên gần bạn" size="2xl" underline />

          {isGlobalLoading ? (
            <Loading size="md" />
          ) : (
            <div className="relative">
              <Slider {...settings}>
                {teachers.map((teacher) => (
                  <div key={teacher._id} className="px-2 mb-4">
                    <CardTeacher teacher={teacher} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NearbyTeachers;
