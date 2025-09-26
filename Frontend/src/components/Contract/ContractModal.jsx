import { FiDownload, FiX } from "react-icons/fi";
import { saveBlobFile } from "@utils/file";
import { useState } from "react";
import { download } from "@api/contract";
import toast from "react-hot-toast";
import Button from "@components-ui/Button";

const ContractModal = ({ open, onClose, contract }) => {
  const [downloading, setDownloading] = useState(false);

  if (!open) return null;

  const handleDownload = async () => {
    if (!contract?._id) return;
    try {
      setDownloading(true);
      const blob = await download(contract._id); // PDF Blob
      saveBlobFile(blob, `contract-${contract._id}.pdf`);
      toast.success("Tải hợp đồng thành công");
    } catch (err) {
      console.error(err);
      toast.error("Tải hợp đồng thất bại");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString("vi-VN");
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium">Hợp đồng</h3>
          <button
            className="cursor-pointer p-1 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {contract ? (
            <>
              <div>
                <div className="text-sm text-gray-500">Mã hợp đồng</div>
                <div className="font-medium">{contract._id}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Bên A</div>
                <div className="font-medium">
                  {contract?.partyA?.name || "—"}
                </div>
                <div className="text-xs text-gray-500">
                  {contract?.partyA?.email || ""} •{" "}
                  {contract?.partyA?.phone || ""}
                </div>
                <div className="text-xs text-gray-500">
                  {contract?.partyA?.district}, {contract?.partyA?.province}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(contract?.createdAt)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="font-medium">
                  {contract.postId
                    ? "Có bài tuyển dụng"
                    : "Thông tin bài viết trống / Thông tin bên B trống"}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  className="flex items-center gap-3"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <FiDownload />
                  <span>{downloading ? "Đang tải..." : "Tải hợp đồng"}</span>
                </Button>

                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 border rounded hover:bg-gray-50"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </div>
            </>
          ) : (
            <div>Không có dữ liệu hợp đồng. Vui lòng thử lại.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
