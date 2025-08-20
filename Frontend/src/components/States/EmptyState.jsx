import React from "react";
import { FilePlus2 } from "lucide-react";

const EmptyState = ({ message = "Chưa có dữ liệu để hiển thị." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <FilePlus2 className="w-12 h-12 mb-3 text-gray-400" />
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
