import React, { useEffect, useState } from "react";
import { getDistricts, provinces } from "@utils/vnLocation";
import Button from "@components/Button";
import toast from "react-hot-toast";
import { signupUser } from "@api/auth";
import { useNavigate } from "react-router-dom";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    middleName: "",
    name: "",
    email: "",
    password: "",
    district: "",
    province: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProvince) {
      const districts = getDistricts(selectedProvince);
      setDistrictList(districts);
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [selectedProvince]);

  //kiểm tra định dạng email
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

    // Clear error khi đang nhập
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  //kiểm tra từng field
  const validateForm = () => {
    const newErrors = {};

    if (!formData.middleName.trim()) {
      newErrors.middleName = "Vui lòng nhập họ và tên lót.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Mật khẩu ít nhất 6 ký tự.";
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố.";
    }

    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện.";
    }

    return newErrors;
  };

  //xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await signupUser(formData);

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
        });
        setSelectedProvince("");
        setDistrictList([]);
        setErrors({});

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Lỗi đăng ký user:", err);
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
              className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
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
            className="w-full border rounded px-3 py-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </div>

        {/* Tỉnh/Thành phố */}
        <div>
          <label className="block font-medium">Tỉnh / Thành phố</label>
          <select
            name="province"
            value={selectedProvince}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 cursor-pointer"
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

        {/* Quận/Huyện */}
        {districtList.length > 0 && (
          <div>
            <label className="block font-medium">Quận / Huyện</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 cursor-pointer"
            >
              <option value="">Chọn quận / huyện</option>
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

        {/* Submit button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={loading} variant="default">
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupUser;
