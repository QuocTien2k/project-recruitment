import { getListSavedPost } from "@api/user";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const MySavePostSearch = ({ onResults, onUserAction }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    results,
    provinces,
    districts,
  } = useSearchFilter({
    searchType: "post",
    fetchFunction: getListSavedPost,
  });

  // wrapper nhỏ để gắn cờ user action
  const handleChangeWithFlag = (e) => {
    onUserAction?.();
    handleChange(e);
  };

  const handleResetWithFlag = () => {
    onUserAction?.();
    handleResetFilter();
  };

  useEffect(() => {
    onResults(results);
  }, [results, onResults]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Input */}
        <InputField
          name="title"
          placeholder="Tìm theo tiêu đề..."
          value={form.title}
          onChange={handleChangeWithFlag}
          className="flex-1 min-w-[180px]"
        />

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

        {/* Select phường/xã */}
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
    </>
  );
};

export default MySavePostSearch;
