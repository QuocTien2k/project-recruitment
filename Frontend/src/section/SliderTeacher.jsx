import { getTeacherExperience } from "@api/public";
import CardTeacher from "@components-cards/CardTeacher";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import { setTeacherLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

const SliderTeacher = () => {
  const [listTeacher, setListTeacher] = useState([]);
  const dispatch = useDispatch();
  const isTeacherLoading = useSelector((state) => state.loading.teacher);

  const fetchTeacher = async () => {
    dispatch(setTeacherLoading(true));
    try {
      const res = await getTeacherExperience();

      if (res?.success) {
        setListTeacher(res?.data);
      } else {
        toast.error("");
      }
    } catch (err) {
      console.error("Lỗi: ", err);
      const msg = err.response?.data?.message || "Có lỗi khi lấy dữ liệu!";
      toast.error(msg);
    } finally {
      dispatch(setTeacherLoading(false));
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  // cấu hình slider
  const settings = {
    arrows: false, // ẩn mũi tên trái phải
    dots: false, // ẩn chấm tròn điều hướng
    infinite: true, // lặp vô hạn
    speed: 1800, // tốc độ chuyển (ms)
    slidesToShow: 2, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần
    //vertical: true, // chuyển sang vertical
    //verticalSwiping: true, // cho phép swipe dọc (mobile)
    autoplay: true, // bật auto chạy
    autoplaySpeed: 5000, // 5s tự động chuyển slide
    pauseOnHover: true, // hover thì dừng autoplay

    responsive: [
      {
        breakpoint: 1280, // dưới 1280px => ngang
        settings: {
          vertical: false,
          verticalSwiping: false,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // mobile nhỏ hơn 640px => chỉ 1 card
        settings: {
          vertical: false,
          verticalSwiping: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 10000, // giả lập "xl và lớn hơn"
        settings: {
          vertical: true,
          verticalSwiping: true,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <section
        className="py-10 px-2 mx-2 rounded-2xl h-full"
        style={{
          background: "var(--bg-section-1)",
          boxShadow: "var(--section-shadow)",
        }}
      >
        <div className="mx-auto px-2 space-y-4">
          {/* 📌 Tiêu đề slider */}
          <Title text="Giáo viên tiêu biểu" size="2xl" underline />
          {isTeacherLoading ? (
            <Loading size="md" />
          ) : (
            <>
              <Slider {...settings}>
                {listTeacher.map((teacher) => (
                  <div key={teacher._id} className="px-2 mb-4">
                    <CardTeacher key={teacher._id} teacher={teacher} />
                  </div>
                ))}
              </Slider>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SliderTeacher;
