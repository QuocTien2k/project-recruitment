import { useState } from "react";
import SignupTeacher from "@components-signup/SignupTeacher";
import SignupUser from "@components-signup/SignupUser";
import { Link } from "react-router-dom";

const Signup = () => {
  const [isTeacher, setIsTeacher] = useState(false);

  const toggleRole = () => setIsTeacher((prev) => !prev);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-auth-signup)" }}
    >
      <div
        className="w-full max-w-lg bg-white rounded p-6 max-h-screen overflow-hidden"
        style={{ boxShadow: "var(--section-shadow)" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Đăng ký {isTeacher ? "Gia sư" : "Người dùng"}
        </h2>

        {/* Cuộn nội dung form bên trong */}
        <div className="scroll-y-hidden max-h-[480px] pr-2">
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
            to="/dang-nhap"
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
