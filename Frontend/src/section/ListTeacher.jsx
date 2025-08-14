import { getTeacherShortList } from "@/apiCalls/public";
import CardTeacher from "@/components/CardTeacher";
import Loading from "@/components/Loading";
import { setTeacherLoading } from "@/redux/loadingSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ListTeacher = () => {
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
      {isTeacherLoading ? (
        <Loading size="md" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listTeacher.map((teacher) => (
            <CardTeacher key={teacher._id} teacher={teacher} />
          ))}
        </div>
      )}
    </>
  );
};

export default ListTeacher;
