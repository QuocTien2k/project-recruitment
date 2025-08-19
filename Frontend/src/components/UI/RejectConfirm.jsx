import { useState } from "react";
import Button from "@/components/UI/Button";

const RejectConfirm = ({ title, message, postId, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-gray-600 mb-4 text-sm">ID: {postId}</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded p-2 text-sm"
          placeholder="Nhập lý do từ chối..."
          rows={4}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="danger" onClick={onCancel}>
            Hủy
          </Button>
          <Button disabled={!reason.trim()} onClick={() => onConfirm(reason)}>
            Từ chối
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectConfirm;
