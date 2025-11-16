import Title from "@components-ui/Title";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

const SliderSchool = () => {
  const sliderRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);

  // Hàm tính toán số slides dựa trên window width
  const getSlidesToShow = (width) => {
    if (width < 375) return 1;
    if (width < 640) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    if (width < 1280) return 5;
    return 6;
  };

  // Detect breakpoint ban đầu
  useEffect(() => {
    const initialBreakpoint = getSlidesToShow(window.innerWidth);
    setCurrentBreakpoint(initialBreakpoint);
    setIsClient(true);

    // Force refresh sau khi mount
    const timer = setTimeout(() => {
      if (sliderRef.current) {
        // Dispatch resize event để slider recalculate
        window.dispatchEvent(new Event("resize"));

        // Go to first slide
        sliderRef.current.slickGoTo(0);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Handle resize với debounce
  useEffect(() => {
    if (!isClient) return;

    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newBreakpoint = getSlidesToShow(window.innerWidth);

        // Chỉ update khi breakpoint thực sự thay đổi
        if (newBreakpoint !== currentBreakpoint) {
          setCurrentBreakpoint(newBreakpoint);

          if (sliderRef.current) {
            sliderRef.current.slickGoTo(
              sliderRef.current.innerSlider.state.currentSlide
            );
          }
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isClient, currentBreakpoint]);

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

  const settings = {
    ref: sliderRef,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    cssEase: "ease-in-out",
    slidesToShow: currentBreakpoint || 6, // Sử dụng state breakpoint
    swipeToSlide: true,
    touchThreshold: 10, //độ nhạy khi vuốt
    adaptiveHeight: false, //chieu cao co dinh o mobile
    lazyLoad: "ondemand", //chỉ load khi co hinh
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!isClient || currentBreakpoint === null) {
    return (
      <section className="py-10 px-2 mx-2 rounded-2xl bg-white">
        <div className="max-w-7xl mx-auto px-2 space-y-8">
          <Title text="Đối tác liên kết" align="center" size="2xl" />
          <div className="h-36 flex items-center justify-center">
            <p className="text-gray-400">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-10 px-2 mx-2 rounded-2xl bg-white"
      style={{
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 space-y-8">
        <Title text="Đối tác liên kết" align="center" size="2xl" />
        <div className="slider-wrapper w-full overflow-hidden">
          <Slider {...settings} key={currentBreakpoint}>
            {dataImg.map((src, index) => (
              <div key={index} className="px-3">
                <div className="flex justify-center items-center h-28 sm:h-32 md:h-36">
                  <img
                    src={src}
                    alt={`Logo trường ${index + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default SliderSchool;
