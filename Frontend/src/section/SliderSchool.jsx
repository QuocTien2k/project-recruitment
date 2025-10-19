import Title from "@components-ui/Title";
import React from "react";
import Slider from "react-slick";

const SliderSchool = () => {
  const dataImg = [
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dhkt.jpg",
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dhyd.jpg",
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dhnt.jpg",
    "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-DH-Su-Pham-TPHCM-HCMUE.png",
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dhnv.jpg",
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dh-khtn.jpg",
    "https://giasumacdinhchi.vn/wp-content/uploads/2024/06/logo-dhbk.jpg",
    "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-DH-Van-Hien-VHU-1024x1024.png",
    "https://thuvienvector.vn/wp-content/uploads/2025/10/logo-vlu-dh-van-lang.jpg",
    "https://imgcdn.tapchicongthuong.vn/thumb/w_1000/tcct-media/mr-trung/truong-dai-hoc-cong-nghiep-thuc-pham-tp-hcm-hufi-chinh-thuc-doi-ten-thanh-truong-dai-hoc-cong-thuong-tp-hcm-huit-2.jpg",
  ];

  // cấu hình slider
  const settings = {
    arrows: false,
    dots: false, // ẩn chấm tròn
    infinite: true,
    speed: 1500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    slidesToShow: 5, // mặc định (desktop)
    // responsive breakpoints
    responsive: [
      {
        breakpoint: 640, // sm
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768, // md
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024, // lg
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 1280, // xl
        settings: { slidesToShow: 6 },
      },
      {
        breakpoint: 1536, // 2xl
        settings: { slidesToShow: 7 },
      },
    ],
  };

  return (
    <section
      className="py-10 px-2 mx-2 rounded-2xl bg-white"
      style={{
        boxShadow: "var(--section-shadow)",
      }}
    >
      <div className="max-w-[var(--width-8xl)] mx-auto px-2 space-y-8">
        <Title text="Đối tác liên kết" size="2xl" align="center" />
        <Slider {...settings}>
          {dataImg.map((src, index) => (
            <div key={index} className="px-3">
              <div className="flex justify-center items-center">
                <img
                  src={src}
                  alt={`Logo trường ${index + 1}`}
                  className="w-30 h-30 md:w-32 md:h-32 object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SliderSchool;
