import { getTeacherSimilar } from "@api/public";
import CardTeacher from "@components-cards/CardTeacher";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";

const SliderTeacherSimilar = ({ idTeacherDetail }) => {
  const [teacherSimilar, setTeacherSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSimilar = async () => {
    setLoading(true);
    try {
      const res = await getTeacherSimilar(idTeacherDetail);
      setTeacherSimilar(res?.data);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết giáo viên:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilar();
  }, []);

  const [slidesToShow, setSlidesToShow] = useState(4);

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

  // cấu hình slider
  const settings = {
    arrows: false, // ẩn mũi tên trái phải
    dots: true, // ẩn chấm tròn điều hướng
    infinite: true, // lặp vô hạn
    speed: 1800, // tốc độ chuyển (ms)
    slidesToShow, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần
    autoplay: true, // bật auto chạy
    autoplaySpeed: 5000, // 5s tự động chuyển slide
    pauseOnHover: true, // hover thì dừng autoplay
  };

  //console.log("Danh sách: ", teacherSimilar);

  return (
    <>
      <div className="my-4 mx-auto px-2 space-y-4">
        {/* 📌 Tiêu đề slider */}
        <Title text="Giáo viên tương tự" size="2xl" underline />
        {loading ? (
          <Loading size="md" />
        ) : (
          <>
            <Slider {...settings}>
              {teacherSimilar.map((teacher) => (
                <div key={teacher._id} className="px-2 mb-4">
                  <CardTeacher teacher={teacher} />
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </>
  );
};

export default SliderTeacherSimilar;
