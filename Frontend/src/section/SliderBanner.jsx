import Button from "@components-ui/Button";
import React from "react";
import Slider from "react-slick";

const SliderBanner = () => {
  const banners = [
    {
      id: 1,
      image: "/banner/bg-1.png",
      alt: "Tìm gia sư phù hợp",
      title: "Tìm Gia Sư Phù Hợp",
      description: "Kết nối với hàng ngàn gia sư uy tín trên toàn quốc",
    },
    {
      id: 2,
      image: "/banner/bg-2.jpg",
      alt: "Đăng tin tuyển dụng",
      title: "Đăng Tin Nhanh Chóng",
      description:
        "Đăng yêu cầu tìm gia sư chỉ trong vài phút, tiếp cận hàng nghìn ứng viên",
    },
    {
      id: 3,
      image: "/banner/bg-3.jpg",
      alt: "Kết nối trực tiếp",
      title: "Trò Chuyện Trực Tiếp",
      description:
        "Chat ngay với gia sư để trao đổi chi tiết và tìm người phù hợp nhất",
    },
    {
      id: 4,
      image: "/banner/bg-4.jpg",
      alt: "Tuyển dụng hiệu quả",
      title: "Tuyển Dụng Dễ Dàng",
      description:
        "Nhận ứng tuyển từ gia sư, lựa chọn và ký hợp đồng một cách thuận tiện",
    },
  ];

  // cấu hình slider
  const settings = {
    arrows: false,
    dots: true, // ẩn chấm tròn
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: false,
    cssEase: "ease",
    slidesToShow: 1, // mặc định (desktop)
    lazyLoad: "progressive",
  };

  return (
    <section
      className="py-10 px-2 mx-2 rounded-2xl bg-white"
      style={{
        boxShadow: "var(--section-shadow)",
      }}
    >
      <div className="max-w-[var(--width-8xl)] mx-auto px-2 space-y-8">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id} className="outline-none">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden will-change-transform">
                {/* Banner Image */}
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
                    {banner.description}
                  </p>
                  <Button>Khám Phá Ngay</Button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SliderBanner;
