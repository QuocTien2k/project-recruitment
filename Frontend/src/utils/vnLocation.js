import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

export const provinces = getProvinces(); // danh sách tỉnh/thành

export const getDistricts = (provinceCode) => {
  // lấy danh sách huyện theo tỉnh
  const province = provinces.find((p) => p.code === provinceCode);
  const districts = getDistrictsByProvinceCode(provinceCode);

  // Gắn thêm tên tỉnh vào từng huyện
  return districts.map((d) => ({
    ...d,
    provinceName: province?.name || "", // phòng hờ nếu không tìm thấy
  }));
};
