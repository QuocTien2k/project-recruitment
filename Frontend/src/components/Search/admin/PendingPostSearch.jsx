import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";
import InputField from "@components-ui/Input";
import Button from "@components-ui/Button";
import { getPostPending } from "@api/admin";

const PendingPostSearch = ({ onResults, onUserAction }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    provinces,
    districts,
    results,
  } = useSearchFilter({
    searchType: "admin-post",
    fetchFunction: getPostPending,
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
      <InputField
        name="title"
        placeholder="Tìm theo tiêu đề..."
        value={form.title}
        onChange={handleChangeWithFlag}
        className="w-[25%]"
      />

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

      {/* Select quận/huyện */}
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

export default PendingPostSearch;
