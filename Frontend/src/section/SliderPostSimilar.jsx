import { getPostSimilar } from "@api/public";
import PostCard from "@components-post/PostCard";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

const SliderPostSimilar = ({ postId }) => {
  const [postSimilar, setPostSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await getPostSimilar(postId);
      setPostSimilar(res?.data);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết tương tự:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // cấu hình slider
  const settings = {
    arrows: false, // ẩn mũi tên trái phải
    dots: true, // ẩn chấm tròn điều hướng
    infinite: true, // lặp vô hạn
    speed: 1800, // tốc độ chuyển (ms)
    slidesToShow: 4, // số card hiển thị trên màn hình
    slidesToScroll: 1, // số card trượt mỗi lần
    autoplay: true, // bật auto chạy
    autoplaySpeed: 5000, // 5s tự động chuyển slide
    pauseOnHover: true, // hover thì dừng autoplay
  };

  //console.log("Danh sách: ", postSimilar);

  return (
    <div className="my-4 mx-auto px-2 space-y-4">
      <Title text="Bài viết tương tự" size="2xl" underline />

      {loading ? (
        <Loading size="md" />
      ) : postSimilar.length === 0 ? (
        <p className="text-center text-gray-500">Không có bài viết tương tự.</p>
      ) : postSimilar.length < 4 ? (
        // ⚡ Nếu ít hơn 4 bài → dùng flex
        <div className="flex flex-wrap justify-start gap-4">
          {postSimilar.map((post) => (
            <div
              key={post._id}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%]"
            >
              <PostCard
                post={post}
                onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        // ⚡ Nếu đủ 4 bài trở lên → dùng slider
        <Slider {...settings}>
          {postSimilar.map((post) => (
            <div key={post._id} className="px-2 mb-4">
              <PostCard
                post={post}
                onViewDetail={() => navigate(`/bai-viet/${post.slug}`)}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SliderPostSimilar;
