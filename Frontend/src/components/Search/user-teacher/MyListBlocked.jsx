import { getBlockList } from "@api/block";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const MyListBlocked = ({ onResults, onUserAction }) => {
  const currentUser = useSelector((state) => state.currentUser.user);

  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "my-list-block",
    currentUser,
    fetchFunction: getBlockList,
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
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {/* Input search name */}
      <InputField
        name="name"
        placeholder="Tìm theo tên..."
        value={form.name}
        onChange={handleChangeWithFlag}
        className="w-[25%]"
      />
      {/* Input search email */}
      <InputField
        name="email"
        placeholder="Tìm theo email..."
        value={form.email}
        onChange={handleChangeWithFlag}
        className="w-[25%]"
      />

      {/* Reset button */}
      <Button variant="reset" onClick={handleResetWithFlag}>
        Reset
      </Button>
    </div>
  );
};

export default MyListBlocked;
