import { getListTeacherNearBy } from "@api/user";
import CardTeacher from "@components-cards/CardTeacher";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import { setGlobalLoading } from "@redux/loadingSlice";
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

  // cấu hình slider
  const settings = {
    arrows: false, // ẩn mũi tên trái phải
    dots: false, // ẩn chấm tròn điều hướng
    infinite: true, // lặp vô hạn
    speed: 1800, // tốc độ chuyển (ms)
    slidesToShow, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần
    autoplay: true, // bật auto chạy
    autoplaySpeed: 5000, // 5s tự động chuyển slide
    pauseOnHover: true, // hover thì dừng autoplay
  };
  //console.log(teachers);

  return (
    <>
      <div className="mx-auto px-2 space-y-4">
        {/* 📌 Tiêu đề */}
        <Title text="Giáo viên gần bạn" size="2xl" underline />

        {isGlobalLoading ? (
          <Loading size="md" />
        ) : (
          <Slider {...settings}>
            {teachers.map((teacher) => (
              <div key={teacher._id} className="px-2 mb-4">
                <CardTeacher teacher={teacher} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </>
  );
};

export default NearbyTeachers;
