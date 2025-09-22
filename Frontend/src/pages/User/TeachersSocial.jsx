import CardTeacher from "@components-cards/CardTeacher";
import TeachersSocialSearch from "@components-search/user-teacher/TeachersSocialSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

const TeachersSocial = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listTeacher, setListTeacher] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 8;

  const [searchParams, setSearchParams] = useSearchParams();
  // đọc từ URL (mặc định = 1), convert sang index (0-based)
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = pageFromUrl - 1; // react-paginate cần 0-based

  // khi đổi trang (newPage = index từ react-paginate)
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage + 1); // convert index -> page hiển thị
      return params;
    });
  };

  const displayedTeachers = listTeacher.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <div className="p-4 rounded-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white">
        <Link
          to="/"
          className="text-green-600 font-medium transition-transform duration-300 
                           hover:text-black whitespace-nowrap"
        >
          ← Về trang chủ
        </Link>

        <TeachersSocialSearch
          onResults={(results) => {
            setListTeacher(results);
          }}
          onUserAction={() => {
            setHasSearched(true);
            setSearchParams({ page: 0 }); // reset chỉ khi user thao tác
          }}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayedTeachers.map((teacher) => (
            <CardTeacher teacher={teacher} key={teacher._id} />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listTeacher.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default TeachersSocial;
