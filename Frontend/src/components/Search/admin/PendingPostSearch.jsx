import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";
import InputField from "@components-ui/Input";
import Button from "@components-ui/Button";
import { getPostPending } from "@api/admin";
import DatePicker from "react-datepicker";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* Input */}
      <InputField
        name="title"
        placeholder="Tìm theo tiêu đề..."
        value={form.title}
        onChange={handleChangeWithFlag}
        className="w-full"
      />

      {/* Date from */}
      <div className="relative">
        <DatePicker
          selected={form.dateFrom ? new Date(form.dateFrom) : null}
          onChange={(date) =>
            handleChangeWithFlag({
              target: {
                name: "dateFrom",
                value: date ? date.toISOString().split("T")[0] : "",
              },
            })
          }
          placeholderText="Từ ngày"
          dateFormat="yyyy-MM-dd"
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          📅
        </span>
      </div>

      {/* Date to */}
      <div className="relative">
        <DatePicker
          selected={form.dateTo ? new Date(form.dateTo) : null}
          onChange={(date) =>
            handleChangeWithFlag({
              target: {
                name: "dateTo",
                value: date ? date.toISOString().split("T")[0] : "",
              },
            })
          }
          placeholderText="Đến ngày"
          dateFormat="yyyy-MM-dd"
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          📅
        </span>
      </div>

      {/* Select tỉnh/thành */}
      <select
        name="provinceCode"
        value={form.provinceCode}
        onChange={handleChangeWithFlag}
        className="form-select-custom"
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
        className="form-select-custom"
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
