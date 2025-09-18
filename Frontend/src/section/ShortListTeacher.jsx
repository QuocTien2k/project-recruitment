import { getTeacherShortList } from "@api/public";
import CardTeacher from "@components-cards/CardTeacher";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";
import { setTeacherLoading } from "@redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ShortListTeacher = () => {
  const [listTeacher, setListTeacher] = useState([]);
  const dispatch = useDispatch();
  const isTeacherLoading = useSelector((state) => state.loading.teacher);

  const fetchTeacher = async () => {
    dispatch(setTeacherLoading(true));
    try {
      const res = await getTeacherShortList();

      if (res?.success) {
        setListTeacher(res?.data);
      }
    } catch (err) {
      console.error("Lỗi: ", err);
      const msg = err.response?.data?.message || "Có lỗi khi lấy dữ liệu!";
      toast.error(msg);
    } finally {
      dispatch(setTeacherLoading(false));
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <>
      <section
        className="py-10 px-2 mx-2 rounded-2xl"
        style={{
          background: "var(--bg-section-2)",
          boxShadow: "var(--section-shadow)",
        }}
      >
        <div className="mx-auto px-2 space-y-4">
          {/* 📌 Tiêu đề */}
          <Title text="Giáo viên mới" size="2xl" underline />
          {isTeacherLoading ? (
            <Loading size="md" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {listTeacher.map((teacher) => (
                  <CardTeacher key={teacher._id} teacher={teacher} />
                ))}
              </div>

              {/* Nút Xem tất cả */}
              <div className="flex justify-center mt-6">
                <Link
                  to="/danh-sach-giao-vien"
                  className="
            py-2 px-6 
            bg-white text-black
    border border-green-400
    rounded-lg 
    shadow-sm
    hover:bg-green-50 hover:border-green-500
            transition 
            font-medium duration-300 transform hover:scale-95"
                >
                  Xem tất cả giáo viên
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ShortListTeacher;
