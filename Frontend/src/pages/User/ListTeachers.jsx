import CardTeacher from "@/components/Cards/CardTeacher";
import Loading from "@/components/UI/Loading";
import Pagination from "@/components/UI/Pagination";
import ListTeacherSerach from "@/components/Search/user-teacher/ListTeacherSearch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ListTeachers = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listTeacher, setListTeacher] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  const displayedTeachers = listTeacher.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [listTeacher]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <ListTeacherSerach onResults={setListTeacher} />
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {isGlobalLoading ? (
        <Loading size="md" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedTeachers.map((teacher) => (
            <CardTeacher teacher={teacher} key={teacher._id} />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listTeacher.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ListTeachers;
