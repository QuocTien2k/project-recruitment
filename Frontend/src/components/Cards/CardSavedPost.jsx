import React from "react";
import dayjs from "dayjs";
import {
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  CalendarDays,
  User,
} from "lucide-react";
import Button from "@components-ui/Button";
import { useNavigate } from "react-router-dom";

const CardSavedPost = ({ post, onDelete }) => {
  const navigate = useNavigate();
  if (!post) return null;

  const vietsubWorkingType = {
    offline: "Offline",
    online: "Online",
    both: "Cả hai (Online và Offline)",
  };

  const formatted = dayjs(post?.createdAt).format("DD/MM/YYYY");

  //console.log(post);

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Nội dung */}
      <h2 className="text-lg font-semibold line-clamp-1">{post?.title}</h2>

      <div className="flex flex-col gap-2 text-sm text-gray-700">
        {/*Địa điểm */}
        <p className="flex items-center gap-2">
          <MapPin className="text-red-500 w-4 h-4" />
          <span>
            {post?.district}, {post?.province}
          </span>
        </p>

        {/*Lương */}
        <p className="flex items-center gap-2">
          <DollarSign className="text-green-500 w-4 h-4" />
          <strong>Mức lương:</strong>
          <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shadow-sm">
            {post?.salary}
          </strong>
        </p>

        {/*hình thức làm việc */}
        <p className="flex items-center gap-2">
          <Briefcase className="text-blue-500 w-4 h-4" />
          <span>Hình thức: {vietsubWorkingType[post?.workingType]}</span>
        </p>

        {/*Thời gian làm việc */}
        <p className="flex items-center gap-2">
          <Clock className="text-yellow-500 w-4 h-4" />
          <span>Thời gian: {post?.timeType}</span>
        </p>

        <p className="flex items-center gap-1">
          <User className="text-blue-500 w-4 h-4" />
          {post?.createdByName}
        </p>

        <div className="flex items-center text-xs text-gray-500">
          <CalendarDays className="text-emerald-500 w-4 h-4" />
          <span className="ml-1 font-medium text-gray-600">
            Ngày đăng: {formatted}
          </span>
        </div>

        <div className="pt-2 flex justify-center items-center gap-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/bai-viet/${post?.slug}`)}
          >
            Xem chi tiết
          </Button>
          <Button onClick={onDelete} variant="danger" size="sm">
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardSavedPost;
