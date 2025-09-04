import { getTeacherActive } from "@api/admin";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const ActiveTeacherSearch = ({ onResults, onUserAction }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    provinces,
    districts,
    results,
  } = useSearchFilter({
    searchType: "admin-teacher",
    fetchFunction: getTeacherActive,
  });

  useEffect(() => {
    onResults(results);
  }, [results, onResults]);

  // wrapper nhỏ để gắn cờ user action
  const handleChangeWithFlag = (e) => {
    onUserAction?.();
    handleChange(e);
  };

  const handleResetWithFlag = () => {
    onUserAction?.();
    handleResetFilter();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {/* Input */}
      {/* <InputField
        name="userId"
        placeholder="Tìm theo id..."
        value={form.userId}
        onChange={handleChangeWithFlag}
        className="w-[20%]"
      /> */}

      <InputField
        name="name"
        placeholder="Tìm theo name..."
        value={form.name}
        onChange={handleChangeWithFlag}
        className="w-[20%]"
      />

      <InputField
        name="email"
        placeholder="Tìm theo email..."
        value={form.email}
        onChange={handleChangeWithFlag}
        className="w-[20%]"
      />

      {/* Select khoa/bộ môn */}
      <select
        name="faculty"
        value={form.faculty}
        onChange={handleChangeWithFlag}
        className="form-select-custom w-[20%]"
      >
        <option value="">Khoa/Bộ môn</option>
        <option value="xahoi">Xã hội</option>
        <option value="tunhien">Tự nhiên</option>
        <option value="ngonngu">Ngoại ngữ</option>
        <option value="khac">Khác</option>
      </select>

      {/* Select tỉnh/thành */}
      <select
        name="provinceCode"
        value={form.provinceCode}
        onChange={handleChangeWithFlag}
        className="form-select-custom w-[20%]"
      >
        <option value="">Tỉnh/Thành</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Select phường/xã */}
      <select
        name="districtCode"
        value={form.districtCode}
        onChange={handleChangeWithFlag}
        className="form-select-custom w-[15%]"
        disabled={!districts.length}
      >
        <option value="">Phường/Xã</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Reset button */}
      <Button onClick={handleResetWithFlag} variant="reset">
        Reset
      </Button>
    </div>
  );
};

export default ActiveTeacherSearch;
