import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDistricts, getProvinces } from "@utils/vnLocation";
import { signupTeacher } from "@api/auth";
import toast from "react-hot-toast";
import Button from "@components-ui/Button";

const SignupTeacher = () => {
  const [formData, setFormData] = useState({
    middleName: "",
    name: "",
    email: "",
    password: "",
    district: "",
    province: "",
    phone: "",
    experience: "",
    workingType: "",
    timeType: "",
    subject: "",
    description: "",
    degreeImages: [],
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{9}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "phone" ? value.replace(/\D/g, "") : value;

    if (name === "province") {
      setSelectedProvince(formattedValue);
      setFormData((prev) => ({ ...prev, province: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, degreeImages: files }));
    setErrors((prev) => ({ ...prev, degreeImages: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.middleName.trim())
      newErrors.middleName = "Vui lòng nhập họ và tên lót.";
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên.";

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mật khẩu ít nhất 6 ký tự.";

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!formData.province)
      newErrors.province = "Vui lòng chọn tỉnh/thành phố.";
    if (!formData.district) newErrors.district = "Vui lòng chọn quận/huyện.";

    if (!formData.experience) {
      newErrors.experience = "Vui lòng nhập số năm kinh nghiệm.";
    } else if (Number(formData.experience) < 0) {
      newErrors.experience = "Số năm kinh nghiệm không được là số âm.";
    } else if (Number(formData.experience) > 60) {
      newErrors.experience = "Số năm kinh nghiệm tối đa là 60.";
    }

    if (!formData.workingType)
      newErrors.workingType = "Vui lòng chọn hình thức làm việc.";
    if (!formData.timeType)
      newErrors.timeType = "Vui lòng chọn thời gian làm việc.";
    if (!formData.subject.trim()) newErrors.subject = "Vui lòng nhập môn học.";
    if (!formData.description.trim())
      newErrors.description = "Vui lòng nhập mô tả.";

    if (formData.degreeImages.length === 0)
      newErrors.degreeImages = "Vui lòng tải lên ít nhất 1 ảnh bằng cấp.";
    if (formData.degreeImages.length > 2)
      newErrors.degreeImages = "Chỉ được phép upload tối đa 2 ảnh bằng cấp.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Tìm tên tỉnh từ danh sách provinces dựa trên code đang lưu
    const selectedProvinceName = provinces.find(
      (prov) => prov.code === formData.province
    )?.name;

    // Tạo bản sao formData với tên tỉnh thay vì mã
    const submitData = {
      ...formData,
      province: selectedProvinceName || "", // nếu không tìm thấy thì fallback rỗng
    };

    try {
      const data = new FormData();
      for (const key in submitData) {
        if (key === "degreeImages") {
          submitData.degreeImages.forEach((file) =>
            data.append("degreeImages", file)
          );
        } else {
          data.append(key, submitData[key]);
        }
      }

      const res = await signupTeacher(data);

      if (res?.success) {
        toast.success(res.message || "Đăng ký thành công!");

        setFormData({
          middleName: "",
          name: "",
          email: "",
          password: "",
          district: "",
          province: "",
          phone: "",
          experience: "",
          workingType: "",
          timeType: "",
          subject: "",
          description: "",
          degreeImages: [],
        });

        setSelectedProvince("");
        setDistrictList([]);
        setErrors({});

        setTimeout(() => {
          navigate("/dang-nhap");
        }, 2000);
      }
    } catch (err) {
      console.error("Lỗi đăng ký teacher:", err);
      const errorMsg =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scroll-y-hidden max-h-[600px] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ và tên lót + Tên */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Họ và tên lót</label>
            <input
              type="text"
              name="middleName"
              placeholder="Họ và tên lót ..."
              value={formData.middleName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.middleName && (
              <span className="text-red-500 text-sm">{errors.middleName}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Tên</label>
            <input
              type="text"
              name="name"
              placeholder="Tên ..."
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
        </div>

        {/* Email + Mật khẩu */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email ..."
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu ..."
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block font-medium">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại..."
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </div>

        {/* Tỉnh / Thành phố */}
        <div>
          <label className="block font-medium">Tỉnh / Thành phố</label>
          <select
            name="province"
            value={selectedProvince}
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
            <span className="text-red-500 text-sm">{errors.province}</span>
          )}
        </div>

        {/* Phường/Xã */}
        {districtList.length > 0 && (
          <div>
            <label className="block font-medium">Phường / Xã</label>
            <select
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
              <span className="text-red-500 text-sm">{errors.district}</span>
            )}
          </div>
        )}

        {/* Năm kinh nghiệm + môn dạy */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Số năm k/nghiệm</label>
            <input
              type="number"
              name="experience"
              placeholder="VD: 2"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.experience && (
              <span className="text-red-500 text-sm">{errors.experience}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Môn giảng dạy</label>
            <input
              type="text"
              name="subject"
              placeholder="VD: Toán, Lý, Hóa"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
        </div>

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
              <span className="text-red-500 text-sm">{errors.workingType}</span>
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

        {/*Giới thiệu bản thân */}
        <div>
          <label className="block font-medium">Giới thiệu bản thân</label>
          <textarea
            name="description"
            placeholder="Giới thiệu kinh nghiệm, kỹ năng, v.v."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 h-[100px]"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </div>

        {/*Ảnh bằng cấp*/}
        <div>
          <label className="block font-medium mb-1">
            Ảnh bằng cấp (tối đa 2 ảnh)
          </label>

          {/* Label giả làm nút upload */}
          <label
            htmlFor="degreeImages"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Chọn ảnh
          </label>

          {/* Input bị ẩn */}
          <input
            type="file"
            id="degreeImages"
            name="degreeImages"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-600 mt-1">
            {formData.degreeImages.length} ảnh đã chọn
          </p>
          {/* Thông báo lỗi */}
          {errors.degreeImages && (
            <p className="text-red-500 text-sm mt-1">{errors.degreeImages}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <Button type="submit" disabled={loading} variant="default">
            {loading ? "Đang xử lý..." : "Đăng ký giáo viên"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupTeacher;
