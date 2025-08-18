import { updateInfo } from "@/apiCalls/user";
import Button from "@/components/Button";
import { setUserLoading } from "@/redux/loadingSlice";
import { getDistricts, getProvinces } from "@/utils/vnLocation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const UpdateInfo = ({ currentUser, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    phone: currentUser.phone || "",
    province: "", // lưu code (tạm), khi submit sẽ convert sang name
    district: currentUser.district || "",
    workingType: currentUser?.teacher?.workingType || "",
    timeType: currentUser?.teacher?.timeType || "",
    description: currentUser?.teacher?.description || "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [errors, setErrors] = useState({});
  const isLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();

  // Lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);

        const matched = data.find((p) => p.name === currentUser.province);
        if (matched) {
          setSelectedProvince(matched.code);
          setFormData((prev) => ({ ...prev, province: matched.code }));
        }
      } catch (err) {
        console.error("Lỗi khi lấy tỉnh/thành:", err);
      }
    };
    fetchProvinces();
  }, [currentUser.province]);

  // Lấy quận/huyện khi selectedProvince thay đổi
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        if (selectedProvince) {
          const dists = await getDistricts(selectedProvince);
          setDistrictList(dists);
        }
      } catch (err) {
        console.error("Lỗi khi lấy quận/huyện:", err);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setSelectedProvince(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        district: "", // reset quận
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const phoneRegex = /^0\d{9}$/;
  const validateForm = () => {
    const errors = {};

    if (!formData.phone) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!formData.province) errors.province = "Vui lòng chọn tỉnh / thành phố";
    if (!formData.district) errors.district = "Vui lòng chọn quận / huyện";

    if (currentUser.role === "teacher") {
      if (!formData.workingType)
        errors.workingType = "Vui lòng chọn hình thức làm việc";
      if (!formData.timeType)
        errors.timeType = "Vui lòng chọn loại thời gian làm việc";
      if (!formData.description?.trim())
        errors.description = "Vui lòng nhập mô tả";
    }

    return errors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      dispatch(setUserLoading(true));
      // Convert province code -> name
      const provinceName =
        provinces.find((p) => p.code === formData.province)?.name || "";

      const submitData = {
        phone: formData.phone,
        province: provinceName,
        district: formData.district,
        workingType: formData.workingType,
        timeType: formData.timeType,
        description: formData.description,
      };

      const res = await updateInfo(submitData);
      if (res.success) {
        toast.success("Cập nhật thành công");
        onUpdateSuccess(
          {
            phone: res.data.user.phone,
            district: res.data.user.district,
            province: res.data.user.province,
          },
          res.data.teacher || {}
        );
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.error("Cập nhật thất bại");
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  return (
    <div className="bg-modal backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Cập nhật thông tin</h3>
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
          {/* Số điện thoại */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
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

          {/* Phường / Xã */}
          {districtList.length > 0 && (
            <div className="space-y-1">
              <label htmlFor="district" className="block text-sm text-gray-700">
                Phường / Xã
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-select-custom"
              >
                <option value="">Chọn phường / xã</option>
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

          {/* Các trường riêng của teacher */}
          {currentUser.role === "teacher" && (
            <>
              {/* Hình thức làm việc */}
              <div className="space-y-1">
                <label
                  htmlFor="workingType"
                  className="block text-sm text-gray-700"
                >
                  Hình thức làm việc
                </label>
                <select
                  id="workingType"
                  name="workingType"
                  value={formData.workingType}
                  onChange={handleChange}
                  className="form-select-custom"
                >
                  <option value="">Chọn hình thức</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Cả hai</option>
                </select>
                {errors.workingType && (
                  <p className="text-red-500 text-sm">{errors.workingType}</p>
                )}
              </div>

              {/* Loại thời gian */}
              <div className="space-y-1">
                <label
                  htmlFor="timeType"
                  className="block text-sm text-gray-700"
                >
                  Loại thời gian
                </label>
                <select
                  id="timeType"
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
                  <p className="text-red-500 text-sm">{errors.timeType}</p>
                )}
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
                  placeholder="Mô tả kinh nghiệm, phong cách giảng dạy,..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button onClick={onClose} variant="danger">
            Hủy
          </Button>
          <Button onClick={handleUpdate} variant="default" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;
