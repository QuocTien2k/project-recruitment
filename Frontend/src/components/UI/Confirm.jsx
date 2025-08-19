import { confirmAlert } from "react-confirm-alert";
import Button from "./Button";
//import "react-confirm-alert/src/react-confirm-alert.css"; // Chặn style mặc định nếu cần

export const showCustomConfirm = ({ title, message, onConfirm, onCancel }) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="bg-modal backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-blue-600">{title}</h2>
            <p className="mt-2 text-gray-700">{message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => {
                  onCancel?.();
                  onClose();
                }}
                size="sm"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                size="sm"
                variant="danger"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      );
    },
  });
};
