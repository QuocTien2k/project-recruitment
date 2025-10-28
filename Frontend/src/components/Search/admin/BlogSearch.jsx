import { listBlog } from "@api/blog";
import Button from "@components-ui/Button";
import InputField from "@components-ui/Input";
import useSearchFilter from "@hooks/useSearchFilter";
import React, { useEffect } from "react";

const BlogSearch = ({ onResults, onUserAction }) => {
  const { form, handleChange, handleResetFilter, results } = useSearchFilter({
    searchType: "admin-blog",
    fetchFunction: listBlog,
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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        {/* Input */}
        <InputField
          name="title"
          placeholder="Tìm theo tiêu đề..."
          value={form.title}
          onChange={handleChangeWithFlag}
          className="flex-1 w-full"
        />
        {/* Reset button */}
        <Button onClick={handleResetWithFlag} variant="reset">
          Reset
        </Button>
      </div>
    </>
  );
};

export default BlogSearch;
