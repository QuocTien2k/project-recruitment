import { getUserActive } from "@/apiCalls/admin";
import Button from "@components/UI/Button";
import InputField from "@components/UI/Input";
import useSearchFilter from "@/hooks/useSearchFilter";
import React, { useEffect } from "react";

const ActiveUserSearch = ({ onResults }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    provinces,
    districts,
    results,
  } = useSearchFilter({
    searchType: "admin-user",
    fetchFunction: getUserActive,
  });

  useEffect(() => {
    onResults(results);
  }, [results, onResults]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {/* Input */}
      <InputField
        name="id"
        placeholder="Tìm theo id..."
        value={form.id}
        onChange={handleChange}
        className="w-[20%]"
      />

      <InputField
        name="name"
        placeholder="Tìm theo name..."
        value={form.name}
        onChange={handleChange}
        className="w-[20%]"
      />

      <InputField
        name="email"
        placeholder="Tìm theo email..."
        value={form.email}
        onChange={handleChange}
        className="w-[20%]"
      />

      {/* Select tỉnh/thành */}
      <select
        name="provinceCode"
        value={form.provinceCode}
        onChange={handleChange}
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

export default ActiveUserSearch;
