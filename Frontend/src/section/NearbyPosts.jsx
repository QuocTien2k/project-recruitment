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
