import { getMyPosts } from "@api/post";
import useSearchFilter from "@hooks/useSearchFilter";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";

const MyPostSearch = ({ onResults, onUserAction }) => {
  const currentUser = useSelector((state) => state.currentUser.user);

  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "mypost",
    currentUser,
    fetchFunction: getMyPosts,
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
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Input search title */}
      <InputField
        name="title"
        placeholder="Tìm theo tiêu đề..."
        value={form.title}
        onChange={handleChangeWithFlag}
      />

      {/* Select status */}
      <select
        name="status"
        value={form.status}
        onChange={handleChangeWithFlag}
        className="form-select-custom w-[30%]"
      >
        <option value="">Tất cả</option>
        <option value="pending">Chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Từ chối</option>
      </select>

      {/* Reset button */}
      <Button variant="reset" onClick={handleResetWithFlag}>
        Reset
      </Button>
    </div>
  );
};

export default MyPostSearch;
