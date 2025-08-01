import { createPost } from "@/apiCalls/post";
import Button from "@/components/Button";
import { setUserLoading } from "@/redux/loadingSlice";
import { getDistricts, getProvinces } from "@/utils/vnLocation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const CreatePost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    district: "",
    province: "",
    salary: "",
    workingType: "",
    timeType: "",
  });
  const isLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [provinces, setProvinces] = useState([]);

  //thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };

    fetchProvinces();
  }, []);

  //Phường xã
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        const districts = await getDistricts(selectedProvince);
        setDistrictList(districts);
        setFormData((prev) => ({ ...prev, district: "" }));
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setSelectedProvince(value); // Trigger useEffect để load lại quận/huyện
      setFormData((prev) => ({ ...prev, province: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error khi đang nhập
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng tiêu đề.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng mô tả.";
    }

    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố.";
    }

    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện.";
    }

    if (!formData.salary) {
      newErrors.salary = "Vui lòng nhập lương.";
    }

    if (!formData.workingType)
      newErrors.workingType = "Vui lòng chọn hình thức làm việc.";

    if (!formData.timeType)
      newErrors.timeType = "Vui lòng chọn thời gian làm việc.";

    return newErrors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(setUserLoading(true)); // Đưa vào đúng vị trí sau khi validate qua

    const selectedProvinceName = provinces.find(
      (prov) => prov.code === formData.province
    )?.name;

    const submitData = {
      ...formData,
      province: selectedProvinceName || "",
    };

    try {
      const res = await createPost(submitData);
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => onClose(), 2000); // đóng modal
      }
    } catch (err) {
      console.error("Lỗi tạo bài viết:", err);
      const errorMsg =
        err.response?.data?.message || "Tạo bài thất bại. Vui lòng thử lại.";
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
          <h3 className="text-lg font-semibold">Tạo bài tuyển dụng</h3>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="cursor-pointer p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 space-y-4 scroll-y-hidden max-h-[480px]">
          {/* Tiêu đề + Lương */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Tiêu đề</label>
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề ..."
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title}</span>
              )}
            </div>

            <div>
              <label className="block font-medium">Lương</label>
              <input
                type="text"
                name="salary"
                placeholder="Lương ..."
                value={formData.salary}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.salary && (
                <span className="text-red-500 text-sm">{errors.salary}</span>
              )}
            </div>
          </div>

          {/* Tỉnh / Thành phố */}
          <div className="space-y-1">
            <label htmlFor="province" className="block text-sm text-gray-700">
              Tỉnh / Thành phố
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="form-select-custom"
            >
              <option value="">Chọn tỉnh / thành phố</option>
              {provinces.map((prov) => (
                <option key={prov.code} value={prov.code}>
                  {prov.name}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm">{errors.province}</p>
            )}
          </div>

          {/* Quận / Huyện */}
          {districtList.length > 0 && (
            <div className="space-y-1">
              <label htmlFor="district" className="block text-sm text-gray-700">
                Quận / Huyện
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-select-custom"
              >
                <option value="">Chọn quận / huyện</option>
                {districtList.map((dist) => (
                  <option key={dist.code} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district}</p>
              )}
            </div>
          )}

          {/*Hình thức làm việc + thời gian làm việc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Hình thức làm việc</label>
              <select
                name="workingType"
                value={formData.workingType}
                onChange={handleChange}
                className="form-select-custom"
              >
                <option value="">Chọn hình thức</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              {errors.workingType && (
                <span className="text-red-500 text-sm">
                  {errors.workingType}
                </span>
              )}
            </div>

            <div>
              <label className="block font-medium">Thời gian làm việc</label>
              <select
                name="timeType"
                value={formData.timeType}
                onChange={handleChange}
                className="form-select-custom"
              >
                <option value="">Chọn thời gian</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>
              {errors.timeType && (
                <span className="text-red-500 text-sm">{errors.timeType}</span>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label
              htmlFor="description"
              className="block text-sm text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              placeholder="Mô tả yêu cầu ..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button onClick={onClose} variant="danger">
            Hủy
          </Button>
          <Button onClick={handleCreate} variant="default" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
