import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Xu thế */}
      <section>
        <h2 className="text-3xl font-bold mb-4">XU THẾ</h2>
        <p className="text-gray-700 leading-relaxed">
          Trong kỷ nguyên Cách mạng Công nghiệp 4.0, tri thức và kỹ năng trở
          thành chìa khóa quan trọng cho sự phát triển. Nhu cầu học tập cá nhân
          hóa ngày càng cao, không chỉ từ phía phụ huynh mong muốn con em mình
          học tốt hơn, mà còn từ phía giáo viên, gia sư đang tìm kiếm một môi
          trường minh bạch để tiếp cận nhiều học sinh. Chính vì vậy, một nền
          tảng tuyển dụng gia sư trực tuyến hai chiều ra đời là xu thế tất yếu.
        </p>
      </section>

      {/* Về chúng tôi */}
      <section>
        <h2 className="text-3xl font-bold mb-4">VỀ CHÚNG TÔI</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Website <span className="font-semibold">TutorConnect</span> được phát
          triển với đề tài{" "}
          <em>"Xây dựng website tuyển dụng gia sư trực tuyến"</em>, nhằm tạo ra
          một cầu nối giữa{" "}
          <strong>phụ huynh – học sinh – giáo viên/gia sư</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Khác với các trung tâm gia sư truyền thống, hệ thống của chúng tôi cho
          phép cả phụ huynh lẫn giáo viên chủ động:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Phụ huynh/học viên có thể dễ dàng{" "}
            <strong>đăng tin tuyển gia sư</strong> theo nhu cầu.
          </li>
          <li>
            Giáo viên/gia sư có thể <strong>tạo hồ sơ và ứng tuyển</strong> vào
            các lớp học phù hợp.
          </li>
          <li>
            Hệ thống hỗ trợ{" "}
            <strong>nhắn tin, lưu yêu thích, báo cáo vi phạm</strong> để tăng
            tính minh bạch.
          </li>
        </ul>
      </section>

      {/* Giá trị khác biệt */}
      <section>
        <h2 className="text-3xl font-bold mb-4">GIÁ TRỊ KHÁC BIỆT</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">🔄 Kết nối hai chiều</h3>
            <p>
              Không chỉ phụ huynh tìm gia sư mà giáo viên cũng có thể chủ động
              tìm kiếm cơ hội giảng dạy, tạo ra môi trường tương tác công bằng.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🔒 Minh bạch và tin cậy</h3>
            <p>
              Hồ sơ người dùng và bài đăng rõ ràng, giúp cả hai bên dễ dàng lựa
              chọn và tin tưởng khi kết nối.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">⚡ Nhanh chóng và tiện lợi</h3>
            <p>
              Hệ thống gợi ý thông minh, tìm kiếm và lọc gia sư/lớp học theo
              tiêu chí mong muốn chỉ trong vài giây.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📚 Hỗ trợ đa dạng</h3>
            <p>
              Đáp ứng nhiều cấp học, môn học và nhu cầu khác nhau, từ tiểu học
              đến đại học, từ học thuật đến kỹ năng mềm.
            </p>
          </div>
        </div>
      </section>

      {/* Lý do chọn */}
      <section>
        <h2 className="text-3xl font-bold mb-4">VÌ SAO CHỌN TUTORCONNECT?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            👨‍👩‍👧 Phụ huynh dễ dàng tìm được gia sư phù hợp, an tâm về chất lượng
            và hiệu quả học tập.
          </li>
          <li>
            👩‍🏫 Giáo viên/gia sư mở rộng cơ hội nghề nghiệp, tiếp cận hàng nghìn
            phụ huynh/học sinh.
          </li>
          <li>
            🔐 Hệ thống an toàn, hỗ trợ báo cáo và xử lý các trường hợp vi phạm.
          </li>
          <li>
            💡 Giao diện thân thiện, dễ sử dụng cho cả phụ huynh và giáo viên.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
