import { getListTeacher } from "@/apiCalls/public";
import useSearchFilter from "@/hooks/useSearchFilter";
import React, { useEffect } from "react";
import Button from "@components/UI/Button";
import InputField from "@components/UI/Input";

const ListTeacherSearch = ({ onResults }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    provinces,
    districts,
    results,
  } = useSearchFilter({
    searchType: "teacher",
    fetchFunction: getListTeacher,
  });

  useEffect(() => {
    onResults(results);
  }, [results, onResults]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {/* Input */}
      <InputField
        name="subject"
        placeholder="Tìm theo môn học. Ví dụ: Toán, Sử..."
        value={form.subject}
        onChange={handleChange}
        className="w-[25%]"
      />

      {/* Select kinh nghiệm */}
      <select
        name="experience"
        value={form.experience}
        onChange={handleChange}
        className="form-select-custom w-[10%]"
      >
        <option value="">Kinh nghiệm</option>
        <option value="0-1">0-1 năm</option>
        <option value="2-3">2-3 năm</option>
        <option value="4-5">4-5 năm</option>
        <option value="5+">5 năm trở lên</option>
      </select>

      {/* Select hình thức làm việc */}
      <select
        name="workingType"
        value={form.workingType}
        onChange={handleChange}
        className="form-select-custom w-[15%]"
      >
        <option value="">Hình thức làm việc</option>
        <option value="offline">Offline</option>
        <option value="online">Online</option>
        <option value="both">Cả hai</option>
      </select>

      {/* Select thời gian làm việc */}
      <select
        name="timeType"
        value={form.timeType}
        onChange={handleChange}
        className="form-select-custom w-[15%]"
      >
        <option value="">Thời gian làm việc</option>
        <option value="full-time">full-time</option>
        <option value="part-time">Part-time</option>
      </select>

      {/* Select tỉnh/thành */}
      <select
        name="provinceCode"
        value={form.provinceCode}
        onChange={handleChange}
        className="form-select-custom w-[15%]"
      >
        <option value="">Tỉnh/Thành</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Select quận/huyện */}
      <select
        name="districtCode"
        value={form.districtCode}
        onChange={handleChange}
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
      <Button onClick={handleResetFilter} variant="reset">
        Reset
      </Button>
    </div>
  );
};

export default ListTeacherSearch;
