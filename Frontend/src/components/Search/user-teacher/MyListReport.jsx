import { listReportByUser } from "@api/report";
import Button from "@components-ui/Button";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const MyListReport = ({ onResults, onUserAction }) => {
  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "user-report",
    fetchFunction: listReportByUser,
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
      {/* Select type */}
      <select
        name="status"
        value={form.status}
        onChange={handleChangeWithFlag}
        className="form-select-custom"
      >
        <option value="">Trạng thái</option>
        <option value="pending">Đang chờ</option>
        <option value="resolved">Đã xử lý</option>
      </select>

      {/* Reset button */}
      <Button onClick={handleResetWithFlag} variant="reset">
        Reset
      </Button>
    </div>
  );
};

export default MyListReport;
