// import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

// export const provinces = getProvinces(); // danh sách tỉnh/thành

// export const getDistricts = (provinceCode) => {
//   // lấy danh sách huyện theo tỉnh
//   const province = provinces.find((p) => p.code === provinceCode);
//   const districts = getDistrictsByProvinceCode(provinceCode);

//   // Gắn thêm tên tỉnh vào từng huyện
//   return districts.map((d) => ({
//     ...d,
//     provinceName: province?.name || "", // phòng hờ nếu không tìm thấy
//   }));
// };

/**
 * Lấy danh sách tỉnh/thành từ public/data/provinces.json
 */
export const getProvinces = async () => {
  try {
    const res = await fetch("/data/provinces.json");
    return await res.json(); // [{ code: "01", name: "Hà Nội" }, ...]
  } catch (err) {
    console.error("Lỗi load provinces:", err);
    return [];
  }
};

/**
 * Lấy danh sách phường/xã theo mã tỉnh từ public/data/wards/{code}.json
 */
export const getDistricts = async (provinceCode) => {
  try {
    const res = await fetch(`/data/wards/${provinceCode}.json`);
    return await res.json(); // [{ code, name }, ...]
  } catch (err) {
    console.error(`Lỗi load wards cho ${provinceCode}:`, err);
    return [];
  }
};

/**
 * Lấy tên tỉnh từ code
 */
export const getProvinceName = async (provinceCode) => {
  const provinces = await getProvinces();
  const province = provinces.find((p) => p.code === provinceCode);
  return province ? province.name : "";
};

/**
 * Lấy tên quận/huyện từ code
 */
export const getDistrictName = async (provinceCode, districtCode) => {
  const districts = await getDistricts(provinceCode);
  const district = districts.find((d) => d.code === districtCode);
  return district ? district.name : "";
};
