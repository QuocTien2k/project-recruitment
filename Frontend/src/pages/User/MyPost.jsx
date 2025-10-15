import Button from "@components-ui/Button";
import Loading from "@components-ui/Loading";
import Pagination from "@components-ui/Pagination";
import PostCard from "@components-post/PostCard";
import MyPostSearch from "@components-search/user-teacher/MyPostSearch";
import CreatePost from "@modals/CreatePost";
import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useSelector } from "react-redux";
import Title from "@components-ui/Title";
import NoResult from "@components-states/NoResult";
import EmptyState from "@components-states/EmptyState";
import toast from "react-hot-toast";
import { createWithPost } from "@api/contract";
import ContractModal from "@contract/ContractModal";
import LoginRequired from "../../components/LoginRequired";

const MyPost = () => {
  const isGlobalLoading = useSelector((state) => state.loading.global);
  const currentUser = useSelector((state) => state.currentUser.user);

  const [myPosts, setMyPosts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);

  const [contract, setContract] = useState(null);
  const [openContractModal, setOpenContractModal] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const displayedPosts = myPosts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleUpdatePost = (updatedPost) => {
    if (updatedPost.deleted) {
      setMyPosts((prev) => prev.filter((p) => p._id !== updatedPost._id));
    } else if (
      updatedPost._id &&
      !myPosts.some((p) => p._id === updatedPost._id)
    ) {
      setMyPosts((prev) => [updatedPost, ...prev]);
    } else {
      setMyPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [myPosts]);

  useEffect(() => {
    let timer;
    if (isGlobalLoading) {
      timer = setTimeout(() => setShowLoader(true), 300); // chỉ hiển thị sau 300ms
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isGlobalLoading]);

  const handleCreateContractWithPost = async (postId) => {
    try {
      setCreatingContract(true);
      const newContract = await createWithPost(postId); // gọi API case 2
      setContract(newContract);
      setOpenContractModal(true);
      toast.success("Tạo hợp đồng thành công từ bài viết");
    } catch (err) {
      console.error(err);
      toast.error("Tạo hợp đồng thất bại");
    } finally {
      setCreatingContract(false);
    }
  };

  if (!currentUser) return <LoginRequired />;

  return (
    <>
      <Title text="Bài viết của bạn" className="mb-6" />

      <div className="p-4 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <MyPostSearch
            onResults={setMyPosts}
            onUserAction={() => setHasSearched(true)}
          />
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => setOpenModalCreatePost(true)}
            className="flex items-center"
          >
            <FiFileText className="mr-1" /> Tạo bài tuyển dụng
          </Button>
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      {showLoader ? (
        <Loading size="md" />
      ) : displayedPosts.length === 0 ? (
        hasSearched ? (
          <NoResult message="Không tìm thấy bài viết nào 😢" />
        ) : (
          <EmptyState message="Hiện tại chưa có bài viết nào ✍️" />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPosts.map((post) => (
            <PostCard
              post={post}
              key={post._id}
              showOwnerActions
              showFullDescription
              handleUpdatePost={handleUpdatePost}
              handleCreateContractWithPost={handleCreateContractWithPost}
              creatingContract={creatingContract}
            />
          ))}
        </div>
      )}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={myPosts.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {openModalCreatePost && (
        <CreatePost
          onClose={() => setOpenModalCreatePost(false)}
          handleUpdatePost={handleUpdatePost}
        />
      )}

      {openContractModal && (
        <ContractModal
          open={openContractModal}
          onClose={() => setOpenContractModal(false)}
          contract={contract}
        />
      )}
    </>
  );
};

export default MyPost;
