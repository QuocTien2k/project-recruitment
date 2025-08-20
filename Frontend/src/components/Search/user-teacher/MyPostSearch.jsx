import { getMyPosts } from "@api/post";
import useSearchFilter from "@hooks/useSearchFilter";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";

const MyPostSearch = ({ onResults }) => {
  const currentUser = useSelector((state) => state.currentUser.user);

  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "mypost",
    currentUser,
    fetchFunction: getMyPosts,
  });

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
        onChange={handleChange}
      />

      {/* Select status */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="form-select-custom w-[30%]"
      >
        <option value="">Tất cả</option>
        <option value="pending">Chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Từ chối</option>
      </select>

      {/* Reset button */}
      <Button variant="reset" onClick={handleResetFilter}>
        Reset
      </Button>
    </div>
  );
};

export default MyPostSearch;
