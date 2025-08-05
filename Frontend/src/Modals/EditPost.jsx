import { updatePost } from "@/apiCalls/post";
import { setUserLoading } from "@/redux/loadingSlice";
import { getDistricts, getProvinces } from "@/utils/vnLocation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

  return <div>EditPost</div>;
};

export default EditPost;
