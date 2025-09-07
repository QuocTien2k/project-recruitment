// import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import debounce from "lodash.debounce";
// import { getDistricts, getProvinces } from "@utils/vnLocation";
// import { setGlobalLoading } from "@redux/loadingSlice";

// const initialForms = {
//   teacher: {
//     experience: "",
//     workingType: "",
//     timeType: "",
//     subject: "",
//     provinceCode: "",
//     districtCode: "",
//   },
//   post: {
//     title: "",
//     provinceCode: "",
//     districtCode: "",
//     workingType: "",
//     timeType: "",
//   },
//   mypost: {
//     title: "",
//     status: "",
//   },
//   "admin-post": {
//     title: "",
//     provinceCode: "",
//     districtCode: "",
//   },
//   "admin-user": {
//     id: "",
//     name: "",
//     email: "",
//     provinceCode: "",
//     districtCode: "",
//   },
// };

// export default function useSearchFilter({
//   searchType,
//   currentUser,
//   fetchFunction,
//   debounceTime = 500,
// }) {
//   const [form, setForm] = useState(initialForms[searchType] || {});
//   const [districts, setDistricts] = useState([]);
//   const [provincesData, setProvincesData] = useState([]);
//   const [results, setResults] = useState([]);

//   const dispatch = useDispatch();
//   const fetchFunctionRef = useRef(fetchFunction);
//   fetchFunctionRef.current = fetchFunction;

//   // ===== 1. Load provinces khi mount =====
//   useEffect(() => {
//     (async () => {
//       const provinces = await getProvinces();
//       setProvincesData(provinces);
//     })();
//   }, []);

//   // ===== 2. Load districts khi đổi province =====
//   useEffect(() => {
//     if (!form.provinceCode) {
//       setDistricts([]);
//       return;
//     }
//     (async () => {
//       const districtList = await getDistricts(form.provinceCode);
//       setDistricts(districtList);
//     })();
//   }, [form.provinceCode]);

//   // ===== 3. Handle Change =====
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     //console.log("[DEBUG] Change field:", name, value);
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "provinceCode" ? { districtCode: "" } : {}),
//     }));
//   };

//   // ===== 4. Build Filters =====
//   const buildFilters = () => {
//     const filters = {};
//     const getProvinceNameSync = (code) =>
//       provincesData.find((p) => p.code === code)?.name || "";
//     const getDistrictNameSync = (districtCode) =>
//       districts.find((d) => d.code === districtCode)?.name || "";

//     switch (searchType) {
//       case "teacher":
//         if (form.experience) filters.experience = form.experience;
//         if (form.workingType) filters.workingType = form.workingType;
//         if (form.timeType) filters.timeType = form.timeType;
//         if (form.subject) filters.subject = form.subject;
//         if (form.provinceCode)
//           filters.province = getProvinceNameSync(form.provinceCode);
//         if (form.districtCode)
//           filters.district = getDistrictNameSync(form.districtCode);
//         break;

//       case "post":
//         if (form.title) filters.title = form.title;
//         if (form.provinceCode)
//           filters.province = getProvinceNameSync(form.provinceCode);
//         if (form.districtCode)
//           filters.district = getDistrictNameSync(form.districtCode);
//         if (form.workingType) filters.workingType = form.workingType;
//         if (form.timeType) filters.timeType = form.timeType;
//         break;

//       case "mypost":
//         if (form.title) filters.title = form.title;
//         if (form.status) filters.status = form.status;
//         if (currentUser?._id) filters.createdBy = currentUser._id;
//         break;

//       case "admin-post":
//         if (form.title) filters.title = form.title;
//         if (form.provinceCode)
//           filters.province = getProvinceNameSync(form.provinceCode);
//         if (form.districtCode)
//           filters.district = getDistrictNameSync(form.districtCode);
//         break;

//       case "admin-user":
//         if (form.id) filters.id = form.id;
//         if (form.name) filters.name = form.name;
//         if (form.email) filters.email = form.email;
//         if (form.provinceCode)
//           filters.province = getProvinceNameSync(form.provinceCode);
//         if (form.districtCode)
//           filters.district = getDistrictNameSync(form.districtCode);
//         break;
//     }
//     return filters;
//   };

//   // ===== 5. Debounced fetch khi form thay đổi =====
//   useEffect(() => {
//     const runFetch = debounce(async () => {
//       dispatch(setGlobalLoading(true));
//       try {
//         const filters = buildFilters();
//         //console.log("[DEBUG] Filters gửi lên API:", filters);

//         const res = await fetchFunction(filters);
//         //console.log("[DEBUG] Dữ liệu trả về:", res);

//         setResults(res?.data || []);
//       } catch (error) {
//         console.error("Search Filter Error:", error);
//       } finally {
//         dispatch(setGlobalLoading(false));
//       }
//     }, debounceTime);

//     runFetch();

//     return () => {
//       runFetch.cancel(); // hủy debounce khi unmount hoặc form thay đổi
//     };
//   }, [form, provincesData, districts, searchType, currentUser, debounceTime]);

//   // ===== 6. Reset filter =====
//   const handleResetFilter = () => {
//     setForm(initialForms[searchType] || {});
//     setDistricts([]);
//   };

//   return {
//     form,
//     handleChange,
//     handleResetFilter,
//     provinces: provincesData,
//     districts,
//     results,
//   };
// }

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { getDistricts, getProvinces } from "@utils/vnLocation";
import { setGlobalLoading } from "@redux/loadingSlice";

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
  "my-list-block": {
    name: "",
    email: "",
  },
  "admin-post": {
    title: "",
    provinceCode: "",
    districtCode: "",
    dateFrom: "", // dạng YYYY-MM-DD
    dateTo: "", // dạng YYYY-MM-DD
  },
  "admin-user": {
    id: "",
    name: "",
    email: "",
    provinceCode: "",
    districtCode: "",
  },
  "admin-teacher": {
    //userId: "",
    name: "",
    email: "",
    provinceCode: "",
    districtCode: "",
    faculty: "",
  },
};

export default function useSearchFilter({
  searchType,
  fetchFunction,
  debounceTime = 500,
}) {
  const [form, setForm] = useState(initialForms[searchType] || {});
  const [districts, setDistricts] = useState([]);
  const [provincesData, setProvincesData] = useState([]);
  const [results, setResults] = useState([]);

  const dispatch = useDispatch();

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

  // ===== 4. Build Filters =====
  const buildFilters = () => {
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
        break;

      case "my-list-block":
        if (form.name) filters.name = form.name;
        if (form.email) filters.email = form.email;
        break;

      case "admin-post":
        if (form.title) filters.title = form.title;

        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);

        if (form.dateFrom) filters.dateFrom = form.dateFrom;
        if (form.dateTo) filters.dateTo = form.dateTo;
        break;

      case "admin-user":
        if (form.id) filters.id = form.id;
        if (form.name) filters.name = form.name;
        if (form.email) filters.email = form.email;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        break;

      case "admin-teacher":
        //if (form.userId) filters.userId = form.userId;
        if (form.name) filters.name = form.name;
        if (form.email) filters.email = form.email;
        if (form.provinceCode)
          filters.province = getProvinceNameSync(form.provinceCode);
        if (form.districtCode)
          filters.district = getDistrictNameSync(form.districtCode);
        if (form.faculty) filters.faculty = form.faculty;
        break;
    }
    return filters;
  };

  // ===== 5. Debounced fetch (dùng useMemo để không recreate) =====
  const runFetch = useMemo(
    () =>
      debounce(async (filters) => {
        dispatch(setGlobalLoading(true));
        try {
          const res = await fetchFunction(filters);
          setResults(res?.data || []);
        } catch (error) {
          console.error("Search Filter Error:", error);
        } finally {
          dispatch(setGlobalLoading(false));
        }
      }, debounceTime),
    [dispatch, fetchFunction, debounceTime]
  );

  // Gọi fetch mỗi khi filters thay đổi
  useEffect(() => {
    const filters = buildFilters();
    runFetch(filters);

    return () => runFetch.cancel();
  }, [form, provincesData, districts, searchType, runFetch]);

  // ===== 6. Reset filter =====
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
