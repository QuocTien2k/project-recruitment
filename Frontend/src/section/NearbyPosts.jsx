import { getListPostNearBy } from "@api/user";
import PostCard from "@components-post/PostCard";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import { setGlobalLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

const NearbyPosts = () => {
  const [listPost, setListPost] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const fetchPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getListPostNearBy();

      if (res?.success) {
        setListPost(res?.data);
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
    fetchPost();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 480) setSlidesToShow(1);
      else if (w <= 768) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize();
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

  //Nếu ít bài hơn số slide → hiển thị flex thay vì slider
  const shouldUseSlider = listPost.length >= slidesToShow;

  return (
    <section
      className="py-10 px-2 my-2 rounded-2xl"
      style={{
        background: "var(--bg-section-4)",
        boxShadow: "var(--section-shadow)",
      }}
    >
      <div className="max-w-[var(--width-8xl)] mx-auto px-3 space-y-6">
        <Title text="Danh sách bài viết gần bạn" size="2xl" underline />

        {isGlobalLoading ? (
          <div className="flex justify-center py-8">
            <Loading size="md" />
          </div>
        ) : listPost.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Không có bài viết nào gần bạn.
          </div>
        ) : shouldUseSlider ? (
          <div className="relative">
            <Slider {...settings}>
              {listPost.map((post) => (
                <div key={post._id} className="px-2 mb-4">
                  <PostCard
                    post={post}
                    onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          // 🧱 Layout căn trái khi bài ít
          <div className="flex flex-wrap gap-4 justify-start">
            {listPost.map((post) => (
              <div
                key={post._id}
                className="w-full sm:w-[48%] md:w-[30%] lg:w-[30%]"
              >
                <PostCard
                  post={post}
                  onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyPosts;
