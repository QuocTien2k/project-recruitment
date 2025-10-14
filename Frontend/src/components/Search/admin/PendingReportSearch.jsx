import { listReportPending } from "@api/report";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const PendingReportSearch = ({ onResults, onUserAction }) => {
  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "admin-report",
    fetchFunction: listReportPending,
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
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
      {/* Input */}
      <InputField
        name="email"
        placeholder="Tìm email bị báo cáo..."
        value={form.email}
        onChange={handleChangeWithFlag}
        className="w-full"
      />

      {/* Select type */}
      <select
        name="type"
        value={form.type}
        onChange={handleChangeWithFlag}
        className="form-select-custom"
      >
        <option value="">Thuộc loại</option>
        <option value="post">Bài viết</option>
        <option value="user">Tài khoản</option>
      </select>

      {/* Reset button */}
      <Button onClick={handleResetWithFlag} variant="reset">
        Reset
      </Button>
    </div>
  );
};

export default PendingReportSearch;
