import { getListFavorite } from "@api/user";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const MyFavoriteSearch = ({ onResults, onUserAction }) => {
  const {
    form,
    handleChange,
    handleResetFilter,
    results,
    provinces,
    districts,
  } = useSearchFilter({
    searchType: "my-favorite",
    fetchFunction: getListFavorite,
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
          name="name"
          placeholder="Tìm theo tên..."
          value={form.title}
          onChange={handleChangeWithFlag}
          className="flex-1 min-w-[180px]"
        />

        {/* Email */}
        <InputField
          name="email"
          placeholder="Tìm theo email..."
          value={form.email}
          onChange={handleChangeWithFlag}
          className="flex-1 min-w-[180px]"
        />

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

export default MyFavoriteSearch;
