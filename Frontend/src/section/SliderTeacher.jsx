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
    speed: 500, // tốc độ chuyển (ms)
    slidesToShow: 4, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần

    autoplay: true, // bật auto chạy
    autoplaySpeed: 3000, // 3s tự động chuyển slide
    pauseOnHover: true, // hover thì dừng autoplay

    responsive: [
      {
        breakpoint: 1024, // tablet lớn
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768, // tablet nhỏ
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480, // mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
      <section
        className="py-10 px-2 mx-2 rounded-2xl"
        style={{
          background: `
      linear-gradient(rgba(255, 255, 255, 0) 22.49%, rgb(255, 255, 255) 73.49%),
      linear-gradient(
        264.03deg,
        rgb(187, 247, 208) -10.27%,
        rgb(220, 252, 231) 35.65%,
        rgb(209, 250, 229) 110.66%
      )
    `,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="max-w-[var(--width-8xl)] mx-auto px-2 space-y-6">
          {/* 📌 Tiêu đề slider */}
          <Title text="Giáo viên nhiều kinh nghiệm" size="2xl" underline />
          {isTeacherLoading ? (
            <Loading size="md" />
          ) : (
            <>
              <Slider {...settings}>
                {listTeacher.map((teacher) => (
                  <div key={teacher._id} className="px-2">
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
