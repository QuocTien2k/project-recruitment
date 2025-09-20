import CardBlock from "@components-cards/CardBlock";
import MyListBlocked from "@components-search/user-teacher/MyListBlocked";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyBlock = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [myListBlock, setMyListBlock] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const displayedListBlock = myListBlock.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdateList = (id) => {
    setMyListBlock((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [myListBlock]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  return (
    <>
      <Title text="Danh sách người bị chặn" className="mb-6" />

      {/* Search */}
      <div className="p-4 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <MyListBlocked
            onResults={setMyListBlock}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {showLoader ? (
        <Loading size="md" />
      ) : displayedListBlock.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy người nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có người nào ✍️" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedListBlock.map((item) => (
            <CardBlock
              user={item}
              key={item._id}
              handleUpdateList={handleUpdateList}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={myListBlock.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default MyBlock;
