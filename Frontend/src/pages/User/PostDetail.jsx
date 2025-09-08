import { getPostDetail } from "@api/public";
import { recordPostView } from "@api/viewer";
import Button from "@components-ui/Button";
import Loading from "@components-ui/Loading";
import { useChatContext } from "@context/ChatContext";
import { setGlobalLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  CalendarDays,
} from "lucide-react";
import { FaBookmark } from "react-icons/fa";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const currentUser = useSelector((state) => state.currentUser.user);
  const { openChat } = useChatContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [disableFavorite, setDisableFavorite] = useState(false);

  const fetchPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getPostDetail(slug);
      if (res.success) {
        setPost(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết bài viết:", err);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  // Ghi nhận lượt xem
  const recordView = async (postId) => {
    if (!currentUser?._id || !postId) return;
    try {
      await recordPostView(postId);
    } catch (err) {
      console.error("Lỗi ghi nhận view:", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (post?._id && currentUser?._id) {
      recordView(post?._id);
    }
  }, [post, currentUser]);

  const authorId = post?.createdBy?._id;

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để trò chuyện!");
      return;
    }

    if (currentUser?._id === authorId) {
      toast.error("Không thể trò chuyện với chính mình!");
      return;
    }

    await openChat(authorId);
  };

  const formatted = dayjs(post?.createdAt).format("DD/MM/YYYY");
  //console.log(post);

  const checkFavorite = async () => {
    if (!currentUser || !authorId) return;
    try {
      const res = await checkStatusFavorite(authorId);
      setIsFavorite(res?.isFavorite || false);
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi kiểm tra trạng thái";
      console.error(msg);
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [currentUser, authorId]);

  // Toggle công tắc yêu thích
  const toggleFavorite = async (userId) => {
    if (!currentUser?._id) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!userId || disableFavorite) return; // chặn spam click

    setDisableFavorite(true);
    setTimeout(() => setDisableFavorite(false), 3500); //diabled nút 3.5s

    if (isFavorite) {
      handleRemoveFavorite(userId);
    } else {
      handleAddFavorite(userId);
    }
  };

  return (
    <>
      {isGlobalLoading ? (
        <Loading size="md" />
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:underline block mb-4"
          >
            ← Quay lại trang chủ
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Bên trái: avatar + chat */}
            <div className="flex-shrink-0 flex flex-col justify-center items-center gap-4">
              <img
                src={post?.createdBy?.profilePic?.url || avatarDefault}
                alt={post?.createdBy?.fullName}
                className="w-32 h-32 object-cover rounded-full border"
              />
              {currentUser?.role === "teacher" && (
                <FaBookmark
                  size={24}
                  onClick={() => toggleFavorite(authorId)}
                  className={`transition transform hover:scale-110 ${
                    isFavorite ? "text-amber-500" : "text-gray-400"
                  } ${
                    disableFavorite
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
              )}
              <Button size="sm" variant="default" onClick={handleStartChat}>
                💬 Liên hệ
              </Button>
            </div>

            {/* Bên phải: nội dung chi tiết */}
            <div className="flex-1 space-y-2 text-gray-800">
              <h1 className="text-2xl font-bold">{post?.title}</h1>

              <p className="text-sm italic text-gray-600">
                Người đăng: {post?.createdBy?.fullName}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="text-orange-500 w-4 h-4" />
                {post?.createdBy?.email}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="text-blue-500 w-4 h-4" />
                <span>Hình thức: {post?.workingType}</span>
                <Clock className="text-yellow-500 w-4 h-4" />
                <span>{post?.timeType}</span>
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="text-red-500 w-4 h-4" />
                <span>
                  {post?.district}, {post?.province}
                </span>
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="text-green-500 w-4 h-4" />
                <strong>Mức lương:</strong>
                <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
                  {post?.salary}
                </strong>
              </p>

              <div className="pt-2 scrollable-text max-h-[120px]">
                <p className="font-semibold text-gray-700">Mô tả:</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                  {post?.description}
                </p>
              </div>

              <div className="mt-3 flex items-center text-xs text-gray-500">
                <CalendarDays className="text-emerald-500 w-4 h-4" />
                <span className="ml-1 font-medium text-gray-600">
                  Ngày đăng: {formatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetail;
