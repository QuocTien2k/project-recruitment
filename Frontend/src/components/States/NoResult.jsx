import React from "react";
import { SearchX } from "lucide-react";

const NoResult = ({ message = "Không tìm thấy kết quả." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <SearchX className="w-12 h-12 mb-3 text-gray-400" />
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default NoResult;
