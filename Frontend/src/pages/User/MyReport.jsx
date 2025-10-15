import MyListReport from "@components-search/user-teacher/MyListReport";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

const MyReport = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listReport, setListReport] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const itemsPerPage = 3;

  const displayedReport = listReport.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [listReport]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  //console.log(displayedReport);

  return (
    <>
      <Title text="Danh sách báo cáo" className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <MyListReport
            onResults={setListReport}
            onUserAction={() => setHasSearched(true)}
          />
        </div>
      </div>

      {showLoader ? (
        <Loading size="md" />
      ) : displayedReport.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy báo cáo nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có báo cáo nào ✍️" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedReport.map((item) => (
            <div
              key={item._id}
              className=" bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Ảnh báo cáo */}
              {item.reportPic?.url && (
                <div className="mb-3 cursor-pointer">
                  <img
                    src={item.reportPic.url}
                    alt="Report Image"
                    onClick={() => setPreviewImage(item.reportPic.url)}
                    className="w-full h-40 object-cover rounded-md border border-gray-300 hover:opacity-90 transition"
                  />
                </div>
              )}
              {/* Người báo cáo */}
              <div className="mb-2">
                <p className="text-sm text-gray-500">Người báo cáo:</p>
                <p className="font-medium">{item.reporterId.name}</p>
                <p className="text-xs text-gray-500">{item.reporterId.email}</p>
              </div>
              {/* Người bị báo cáo */}
              <div className="mb-2">
                <p className="text-sm text-gray-500">Người bị báo cáo:</p>
                <p className="font-medium text-red-600">{item.reportedEmail}</p>
              </div>
              {/* Loại & Trạng thái */}
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-100 border border-gray-300">
                  Thuộc loại: {item.type === "user" ? "Tài khoản" : "Bài viết"}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-md ${
                    item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-green-100 text-green-700 border border-green-300"
                  }`}
                >
                  {item.status === "pending" ? "Đang chờ" : "Đã xử lý"}
                </span>
              </div>
              {/* Lý do */}
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Lý do:</p>
                <p className="line-clamp-2">{item.reason}</p>
              </div>
              {/* Ghi chú của admin */}
              {item.adminNote && (
                <div className="text-sm text-gray-700 mt-2">
                  <p className="font-semibold mb-1">Ghi chú của admin:</p>
                  <p className="italic text-gray-600 line-clamp-3">
                    {item.adminNote}
                  </p>
                </div>
              )}
              {/* Ngày tạo */}
              <p className="text-xs text-gray-400 mt-3">
                Ngày gửi: {new Date(item.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
          {/* Modal xem ảnh */}
          {previewImage && (
            <div
              onClick={() => setPreviewImage(null)}
              className="bg-modal backdrop-blur-sm"
            >
              <div className="relative max-w-3xl w-full px-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-h-[80vh] object-contain rounded-md shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="cursor-pointer absolute top-4 right-4 text-white bg-red-500/80 hover:bg-red-600 p-2 rounded-full transition"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={listReport.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default MyReport;
