import { updatePost } from "@/apiCalls/post";
import Button from "@components/UI/Button";
import { setUserLoading } from "@/redux/loadingSlice";
import { getDistricts, getProvinces } from "@/utils/vnLocation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const EditPost = ({ post, onClose, handleUpdatePost }) => {
  const currentUser = useSelector((state) => state.currentUser.user);

  const [formData, setFormData] = useState({
    postId: post._id,
    title: post.title || "",
    province: "", // lưu code (tạm), khi submit sẽ convert sang name
    district: post.district || "",
    workingType: post.workingType || "",
    timeType: post.timeType || "",
    salary: post.salary || "",
    description: post.description || "",
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

        const matched = data.find((p) => p.name === post.province);
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

  const validateForm = () => {
    const errors = {};

    if (!formData.province) errors.province = "Vui lòng chọn tỉnh / thành phố";
    if (!formData.district) errors.district = "Vui lòng chọn quận / huyện";

    if (!formData.title) errors.title = "Vui lòng nhập tiêu đề";
    if (!formData.salary) errors.salary = "Vui lòng nhập lương";
    if (!formData.workingType) errors.workingType = "Vui lòng chọn";
    if (!formData.timeType) errors.timeType = "Vui lòng chọn";
    if (!formData.description) errors.description = "Vui lòng nhập mô tả";

    return errors;
  };

  const handleEdit = async (e) => {
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
        postId: formData.postId,
        title: formData.title,
        salary: formData.salary,
        province: provinceName,
        district: formData.district,
        workingType: formData.workingType,
        timeType: formData.timeType,
        description: formData.description,
      };

      const res = await updatePost(submitData);
      if (res.success) {
        toast.success("Cập nhật thành công");

        handleUpdatePost(res.data); //gọi lại cha để cập nhật

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
  //   console.log(currentUser?._id);
  //   console.log(post);

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
          {/* Tiêu đề */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập tiêu đề"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Lương */}
          <div className="space-y-1">
            <label htmlFor="salary" className="block text-sm text-gray-700">
              Lương
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Nhập lương"
            />
            {errors.salary && (
              <p className="text-red-500 text-sm">{errors.salary}</p>
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
                <option value="both">Cả hai</option>
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
              placeholder="Mô tả yêu cầu ...."
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
          <Button onClick={handleEdit} variant="default" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
