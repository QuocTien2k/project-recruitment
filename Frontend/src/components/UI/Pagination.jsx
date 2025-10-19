import React from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  // react-paginate sẽ trả về event.selected (index bắt đầu từ 0)
  const handlePageClick = (event) => {
    onPageChange(event.selected);
    window.scrollTo({ top: 20, behavior: "smooth" }); //khi chuyển lướt lên đầu trang
  };

  if (pageCount <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          currentPage < pageCount - 1 && (
            <div className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
              <ChevronRight size={16} />
            </div>
          )
        }
        previousLabel={
          currentPage > 0 && (
            <div className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
              <ChevronLeft size={16} />
            </div>
          )
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={currentPage} // đảm bảo đồng bộ state bên ngoài
        containerClassName="flex items-center gap-2"
        pageClassName="cursor-pointer flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-green-500 hover:text-white transition"
        activeClassName="bg-green-500 text-white"
        breakClassName="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100"
      />
    </div>
  );
};

export default Pagination;
