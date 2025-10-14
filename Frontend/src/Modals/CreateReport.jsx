import { createReport } from "@api/report";
import Button from "@components-ui/Button";
import { setUserLoading } from "@redux/loadingSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const CreateReport = ({ onClose }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.user);

  const [formData, setFormData] = useState({
    type: "",
    reportedEmail: "",
    reason: "",
    reportPic: null,
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [errors, setErrors] = useState({});

  // --- Handle change input ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "reportPic" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, reportPic: file }));
      setPreviewImg(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // --- Validate form ---
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.type) newErrors.type = "Vui lòng chọn loại báo cáo.";

    if (!formData.reportedEmail.trim()) {
      newErrors.reportedEmail = "Vui lòng nhập email người bị báo cáo.";
    } else if (!emailRegex.test(formData.reportedEmail.trim())) {
      newErrors.reportedEmail =
        "Email không hợp lệ. Vui lòng nhập đúng định dạng.";
    }

    if (!formData.reason.trim()) newErrors.reason = "Vui lòng nhập lý do.";
    if (!formData.reportPic)
      newErrors.reportPic = "Vui lòng tải lên ít nhất 1 ảnh.";

    return newErrors;
  };

  // --- Handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(setUserLoading(true));

    try {
      const form = new FormData();
      form.append("type", formData.type);
      form.append("reportedEmail", formData.reportedEmail);
      form.append("reason", formData.reason);
      form.append("reportPic", formData.reportPic);

      const res = await createReport(form);

      if (res.success) {
        toast.success("Gửi báo cáo thành công!");
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error("Lỗi gửi báo cáo:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Gửi báo cáo thất bại. Vui lòng thử lại.";
      toast.error(errorMsg);
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-center flex-grow text-gray-800">
            Gửi báo cáo vi phạm
          </h3>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[480px]"
        >
          {/* Loại báo cáo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại báo cáo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select-custom w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Chọn loại</option>
              <option value="user">Người dùng</option>
              <option value="post">Bài đăng</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>

          {/* Email người bị báo cáo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email người bị báo cáo
            </label>
            <input
              type="email"
              name="reportedEmail"
              placeholder="example@gmail.com"
              value={formData.reportedEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.reportedEmail && (
              <p className="text-red-500 text-sm">{errors.reportedEmail}</p>
            )}
          </div>

          {/* Lý do */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lý do báo cáo
            </label>
            <textarea
              name="reason"
              rows={4}
              placeholder="Nhập lý do chi tiết..."
              value={formData.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason}</p>
            )}
          </div>

          {/* Ảnh minh họa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn 1 hình ảnh minh họa
            </label>

            <label
              htmlFor="upload-report-pic"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Chọn ảnh
            </label>

            <input
              id="upload-report-pic"
              type="file"
              name="reportPic"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            {previewImg && (
              <div className="mt-4">
                <img
                  src={previewImg}
                  alt="Ảnh minh họa"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}

            {errors.reportPic && (
              <p className="text-red-500 text-sm mt-2">{errors.reportPic}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button onClick={onClose} variant="danger" type="button">
              Hủy
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi báo cáo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
