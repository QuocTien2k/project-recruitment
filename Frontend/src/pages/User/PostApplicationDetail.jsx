import { getByPost } from "@api/application";
import Loading from "@components-ui/Loading";
import { setGlobalLoading } from "@redux/loadingSlice";
import dayjs from "dayjs";
import {
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  Mail,
  MapPin,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const avatarDefault =
  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000";

const PostApplicationDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const currentUser = useSelector((state) => state.currentUser.user);

  const fetchPost = async () => {
    dispatch(setGlobalLoading(true));
    try {
      const res = await getByPost(slug);
      if (res.success) {
        setPost(res.post); // chỉ lấy post
        setApplications(res.applications); // lấy danh sách ứng viên
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết bài viết:", err);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const formatted = dayjs(post?.createdAt).format("DD/MM/YYYY");
  //   console.log("Id của người tạo bài: ", authorId);
  //console.log("Id của người đang đăng nhập: ", currentUser?._id);
  //console.log(post);

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        <Link
          to="/"
          className="text-sm text-blue-600 hover:underline block mb-4"
        >
          ← Quay lại danh sách
        </Link>

        {isGlobalLoading ? (
          <Loading size="md" />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Bên trái: avatar + chat */}
            <div className="flex-shrink-0 flex flex-col justify-center items-center gap-4">
              <img
                src={post?.createdBy?.profilePic?.url || avatarDefault}
                alt={post?.createdBy?.fullName}
                className="w-32 h-32 object-cover rounded-full border"
              />
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
        )}
      </div>
    </>
  );
};

export default PostApplicationDetail;
