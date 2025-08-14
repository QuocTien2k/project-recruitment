import { getMyPosts } from "@/apiCalls/post";
import useSearchFilter from "@/hooks/useSearchFilter";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@components/Button";

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
      <input
        type="text"
        name="title"
        placeholder="Tìm theo tiêu đề..."
        value={form.title}
        onChange={handleChange}
        className="w-[70%] border border-gray-300 rounded px-3 py-2"
      />

      {/* Select status */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="form-select-custom"
      >
        <option value="">Tất cả</option>
        <option value="pending">Chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Từ chối</option>
      </select>

      {/* Reset button */}
      <Button onClick={handleResetFilter}>Reset</Button>
    </div>
  );
};

export default MyPostSearch;
