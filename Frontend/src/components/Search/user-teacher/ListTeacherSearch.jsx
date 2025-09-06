import { getListTeacher } from "@api/public";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";

const ListTeacherSearch = ({ onResults, onUserAction }) => {
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
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Input */}
      <InputField
        name="subject"
        placeholder="Tìm theo môn học. Ví dụ: Toán, Sử..."
        value={form.subject}
        onChange={handleChangeWithFlag}
        className="flex-1 min-w-[180px]"
      />

      {/* Select kinh nghiệm */}
      <select
        name="experience"
        value={form.experience}
        onChange={handleChangeWithFlag}
        className="form-select-custom flex-1 min-w-[140px]"
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
        onChange={handleChangeWithFlag}
        className="form-select-custom flex-1 min-w-[140px]"
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
        onChange={handleChangeWithFlag}
        className="form-select-custom flex-1 min-w-[140px]"
      >
        <option value="">Thời gian làm việc</option>
        <option value="full-time">full-time</option>
        <option value="part-time">Part-time</option>
      </select>

      {/* Select tỉnh/thành */}
      <select
        name="provinceCode"
        value={form.provinceCode}
        onChange={handleChangeWithFlag}
        className="form-select-custom flex-1 min-w-[140px]"
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
        onChange={handleChangeWithFlag}
        className="form-select-custom flex-1 min-w-[140px]"
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

export default ListTeacherSearch;
