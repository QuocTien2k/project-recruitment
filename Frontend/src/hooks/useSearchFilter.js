import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { getDistricts, getProvinces } from "@/utils/vnLocation";
import { setGlobalLoading } from "@/redux/loadingSlice";

const initialForms = {
  teacher: {
    experience: "",
    workingType: "",
    timeType: "",
    subject: "",
    provinceCode: "",
    districtCode: "",
  },
  post: {
    title: "",
    provinceCode: "",
    districtCode: "",
    workingType: "",
    timeType: "",
  },
  mypost: {
    title: "",
    status: "",
  },
  "admin-post": {
    title: "",
    status: "",
    provinceCode: "",
    districtCode: "",
  },
  "admin-user": {
    name: "",
    email: "",
    role: "",
    isActive: "",
    provinceCode: "",
    districtCode: "",
  },
};

export default function useSearchFilter({
  searchType,
  currentUser,
  fetchFunction,
  debounceTime = 500,
}) {
  const [form, setForm] = useState(initialForms[searchType] || {});
  const [districts, setDistricts] = useState([]);
  const [provincesData, setProvincesData] = useState([]);
  const [results, setResults] = useState([]);

  const dispatch = useDispatch();
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  // ===== 1. Load provinces khi mount =====
  useEffect(() => {
    (async () => {
      const provinces = await getProvinces();
      setProvincesData(provinces);
    })();
  }, []);

  // ===== 2. Load districts khi đổi province =====
  useEffect(() => {
    if (!form.provinceCode) {
      setDistricts([]);
      return;
    }
    (async () => {
      const districtList = await getDistricts(form.provinceCode);
      setDistricts(districtList);
    })();
  }, [form.provinceCode]);

  // ===== 3. Handle Change =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "provinceCode" ? { districtCode: "" } : {}),
    }));
  };

  // ===== 4. Build Filters (sync lookup) =====
  const buildFilters = useCallback(() => {
    const filters = {};
    const getProvinceNameSync = (code) =>
      provincesData.find((p) => p.code === code)?.name || "";
    const getDistrictNameSync = (districtCode) =>
      districts.find((d) => d.code === districtCode)?.name || "";

    switch (searchType) {
      case "teacher":
        if (form.experience) filters.experience = form.experience;
        if (form.workingType) filters.workingType = form.workingType;
        if (form.timeType) filters.timeType = form.timeType;
        if (form.subject) filters.subject = form.subject;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        break;

      case "post":
        if (form.title) filters.title = form.title;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        if (form.workingType) filters.workingType = form.workingType;
        if (form.timeType) filters.timeType = form.timeType;
        break;

      case "mypost":
        if (form.title) filters.title = form.title;
        if (form.status) filters.status = form.status;
        if (currentUser?._id) filters.createdBy = currentUser._id;
        break;

      case "admin-post":
        if (form.title) filters.title = form.title;
        if (form.status) filters.status = form.status;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        break;

      case "admin-user":
        if (form.name) filters.name = form.name;
        if (form.email) filters.email = form.email;
        if (form.role) filters.role = form.role;
        if (form.isActive) filters.isActive = form.isActive;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        break;
    }
    return filters;
  }, [form, provincesData, districts, searchType, currentUser]);

  // ===== 5. Debounce fetch =====
  const debouncedFetch = useRef(
    debounce(async () => {
      dispatch(setGlobalLoading(true));
      try {
        const filters = buildFilters();
        const res = await fetchFunctionRef.current(filters);
        setResults(res?.data || []);
      } catch (error) {
        console.error("Search Filter Error:", error);
      } finally {
        dispatch(setGlobalLoading(false));
      }
    }, debounceTime)
  ).current;

  // ===== 6. Auto fetch khi form thay đổi =====
  useEffect(() => {
    debouncedFetch();
  }, [form, buildFilters, debouncedFetch]);

  // ===== 7. Reset filter =====
  const handleResetFilter = () => {
    setForm(initialForms[searchType] || {});
    setDistricts([]);
  };

  return {
    form,
    handleChange,
    handleResetFilter,
    provinces: provincesData,
    districts,
    results,
  };
}
