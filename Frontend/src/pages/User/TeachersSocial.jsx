import CardTeacher from "@components-cards/CardTeacher";
import TeachersSocialSearch from "@components-search/user-teacher/TeachersSocialSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TeachersSocial = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listTeacher, setListTeacher] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white">
        <Link
          to="/"
          className="text-green-600 font-medium transition-transform duration-300 
                           hover:text-black whitespace-nowrap"
        >
          ← Về trang chủ
        </Link>

        <TeachersSocialSearch
          onResults={setListTeacher}
          onUserAction={() => setHasSearched(true)}
        />
      </div>

      <hr className="border-gray-300 mb-4" />

      {isGlobalLoading ? (
        <Loading size="md" />
      ) : displayedTeachers.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy giáo viên nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có giáo viên nào ✍️" />
        )
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

export default TeachersSocial;
