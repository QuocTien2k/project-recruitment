import { handleReport } from "@api/report";
import PendingReportSearch from "@components-search/admin/PendingReportSearch";
import EmptyState from "@components-states/EmptyState";
import NoResult from "@components-states/NoResult";
import Button from "@components-ui/Button";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import Title from "@components-ui/Title";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

const ListReportPending = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const [listReport, setListReport] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const itemsPerPage = 3;
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); //loading khi bấm nút

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

  const handleConfirmReport = async () => {
    if (!adminNote.trim()) {
      toast.error("Vui lòng nhập ghi chú xử lý!");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await handleReport(selectedReport._id, {
        status: "resolved",
        adminNote,
      });

      if (res.success) {
        toast.success("Xử lý báo cáo thành công.");
        // Xóa report đã xử lý khỏi danh sách hiện tại
        setListReport((prev) =>
          prev.filter((r) => r._id !== selectedReport._id)
        );
        setSelectedReport(null);
      } else {
        toast.error("Xử lý thất bại: " + res.message);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý báo cáo:", err);
      const msg = err?.response?.data?.message || "Lỗi máy chủ khi xử lý";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  //console.log(displayedReport);

  return (
    <>
      <Title text="Danh sách báo cáo chưa xử lý" className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <PendingReportSearch
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
              <div className="flex justify-end mb-2">
                {/* Nút xử lý góc phải */}
                <Button
                  onClick={() => {
                    setSelectedReport(item);
                    setAdminNote(""); // reset ghi chú khi mở modal
                  }}
                  size="sm"
                >
                  Xử lý
                </Button>
              </div>

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

          {/* Modal xử lý báo cáo */}
          {selectedReport && (
            <div
              className="bg-modal backdrop-blur-sm"
              onClick={() => !isSubmitting && setSelectedReport(null)}
            >
              <div
                className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tiêu đề */}
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Xử lý báo cáo
                </h2>

                {/* Thông tin ngắn */}
                <p className="text-sm mb-2">
                  <span className="font-medium text-gray-600">
                    Người bị báo cáo:
                  </span>{" "}
                  <span className="text-red-600">
                    {selectedReport.reportedEmail}
                  </span>
                </p>
                <p className="text-sm mb-4">
                  <span className="font-medium text-gray-600">Lý do:</span>{" "}
                  {selectedReport.reason}
                </p>

                {/* Ghi chú */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú xử lý:
                </label>
                <textarea
                  rows={4}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200"
                  placeholder="Nhập ghi chú cho báo cáo này..."
                />

                {/* Nút hành động */}
                <div className="flex justify-end gap-3 mt-5">
                  <Button
                    variant="danger"
                    onClick={() => setSelectedReport(null)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>

                  <Button onClick={handleConfirmReport} disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                  </Button>
                </div>

                {/* Nút đóng góc phải */}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
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

export default ListReportPending;
