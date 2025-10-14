import CreateReport from "@modals/CreateReport";
import { Flag } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Report = () => {
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);

  // ID admin trong MongoDB
  const ADMIN_ID = "68946f57455a4c49bda694ed";

  if (!currentUser || currentUser._id === ADMIN_ID) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-20 left-6 z-50">
        <button
          onClick={() => setOpenModal(true)}
          className="ping-effect-report cursor-pointer bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all relative"
          title="Gửi báo cáo"
        >
          <Flag size={18} />
        </button>
      </div>
      {openModal && <CreateReport onClose={() => setOpenModal(false)} />}
    </>
  );
};

export default Report;
