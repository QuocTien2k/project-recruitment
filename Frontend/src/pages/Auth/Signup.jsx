import { useState } from "react";
import SignupTeacher from "@components/Signup/SignupTeacher";
import SignupUser from "@components/Signup/SignupUser";
import { Link } from "react-router-dom";

const Signup = () => {
  const [isTeacher, setIsTeacher] = useState(false);

  const toggleRole = () => setIsTeacher((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded p-6 max-h-screen overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Đăng ký {isTeacher ? "Gia sư" : "Người dùng"}
        </h2>

        {/* Cuộn nội dung form bên trong */}
        <div className="scroll-y-hidden overflow-y-auto max-h-[480px] pr-2">
          {isTeacher ? <SignupTeacher /> : <SignupUser />}
        </div>

        {/* Nút chuyển đổi vai trò + Đăng nhập */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div
            onClick={toggleRole}
            className="cursor-pointer hover:underline transition duration-200 text-sm text-blue-600"
          >
            <p>{isTeacher ? "← Đăng ký người dùng" : "Trở thành gia sư →"}</p>
          </div>

          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition duration-200"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
