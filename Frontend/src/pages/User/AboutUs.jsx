import Title from "@components-ui/Title";
import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-[var(--width-8xl)] mx-auto px-4 py-10">
      <div className="grid md:grid-cols-12 gap-8">
        {/* Cột trái: nội dung About Us */}
        <div className="md:col-span-9 space-y-12 bg-white p-6 rounded-lg shadow-sm">
          {/* Xu thế */}
          <section>
            <Title text="Xu thế" size="2xl" className="mb-4 font-poppins" />
            <p className="text-gray-700 leading-relaxed">
              Trong kỷ nguyên Cách mạng Công nghiệp 4.0, tri thức và kỹ năng trở
              thành chìa khóa quan trọng cho sự phát triển. Nhu cầu học tập cá
              nhân hóa ngày càng cao, không chỉ từ phía phụ huynh mong muốn con
              em mình học tốt hơn, mà còn từ phía giáo viên, gia sư đang tìm
              kiếm một môi trường minh bạch để tiếp cận nhiều học sinh. Chính vì
              vậy, một nền tảng tuyển dụng gia sư trực tuyến hai chiều ra đời là
              xu thế tất yếu.
            </p>
          </section>

          {/* Về chúng tôi */}
          <section>
            <Title
              text="Về chúng tôi"
              size="2xl"
              className="mb-4 font-poppins"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              Website <span className="font-semibold">TH</span> được xây dựng
              với đề tài{" "}
              <em>"Xây dựng website tuyển dụng gia sư trực tuyến"</em>. Đây
              không chỉ đơn thuần là một nền tảng đăng tin, mà còn là{" "}
              <strong>
                cầu nối bền vững giữa phụ huynh – học sinh – giáo viên/gia sư
              </strong>
              , nhằm mang đến một môi trường học tập minh bạch, hiệu quả và công
              bằng.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Với sứ mệnh “<em>Bước tiến tương lai</em>”, chúng tôi mong muốn
              tạo ra một không gian nơi phụ huynh có thể dễ dàng tìm thấy gia sư
              chất lượng, học sinh được tiếp cận những phương pháp học tập phù
              hợp, và giáo viên/gia sư có thêm nhiều cơ hội nghề nghiệp. Mỗi kết
              nối thành công không chỉ là một lớp học được mở ra, mà còn là một
              hành trình tri thức được bắt đầu.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Khác với các trung tâm gia sư truyền thống, hệ thống của chúng tôi
              trao cho người dùng sự chủ động:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Phụ huynh/học viên có thể dễ dàng{" "}
                <strong>đăng tin tuyển gia sư</strong> theo nhu cầu cụ thể, từ
                môn học, thời gian, đến phương thức học tập.
              </li>
              <li>
                Giáo viên/gia sư có thể{" "}
                <strong>
                  tạo hồ sơ cá nhân, xây dựng uy tín và chủ động ứng tuyển
                </strong>{" "}
                vào các lớp học phù hợp, thay vì phải chờ trung tâm phân bổ.
              </li>
              <li>
                Hệ thống tích hợp{" "}
                <strong>
                  nhắn tin trực tiếp, lưu danh sách yêu thích, báo cáo vi phạm
                </strong>{" "}
                nhằm tăng tính minh bạch, bảo vệ quyền lợi và trải nghiệm của cả
                hai bên.
              </li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              Chúng tôi tin rằng giáo dục chỉ thực sự hiệu quả khi cả người dạy
              và người học cùng đồng hành trên một nền tảng đáng tin cậy. Và{" "}
              <span className="font-semibold">TH</span> chính là nơi để điều đó
              trở thành hiện thực.
            </p>
          </section>

          {/* Giá trị khác biệt */}
          <section>
            <Title
              text="Giá trị khác biệt"
              size="2xl"
              className="mb-4 font-poppins"
            />
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">🔄 Kết nối hai chiều</h3>
                <p>
                  Không chỉ phụ huynh tìm gia sư mà giáo viên cũng có thể chủ
                  động tìm kiếm cơ hội giảng dạy, tạo ra môi trường tương tác
                  công bằng.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔒 Minh bạch và tin cậy</h3>
                <p>
                  Hồ sơ người dùng và bài đăng rõ ràng, giúp cả hai bên dễ dàng
                  lựa chọn và tin tưởng khi kết nối.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  ⚡ Nhanh chóng và tiện lợi
                </h3>
                <p>
                  Hệ thống gợi ý thông minh, tìm kiếm và lọc gia sư/lớp học theo
                  tiêu chí mong muốn chỉ trong vài giây.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📚 Hỗ trợ đa dạng</h3>
                <p>
                  Đáp ứng nhiều cấp học, môn học và nhu cầu khác nhau, từ tiểu
                  học đến đại học, từ học thuật đến kỹ năng mềm.
                </p>
              </div>
            </div>
          </section>

          {/* Lý do chọn */}
          <section>
            <Title
              text="Vì sao chọn TH?"
              size="2xl"
              className="mb-4 font-poppins"
            />
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                👨‍👩‍👧 Phụ huynh dễ dàng tìm được gia sư phù hợp, an tâm về chất
                lượng và hiệu quả học tập.
              </li>
              <li>
                👩‍🏫 Giáo viên/gia sư mở rộng cơ hội nghề nghiệp, tiếp cận hàng
                nghìn phụ huynh/học sinh.
              </li>
              <li>
                🔐 Hệ thống an toàn, hỗ trợ báo cáo và xử lý các trường hợp vi
                phạm.
              </li>
              <li>
                💡 Giao diện thân thiện, dễ sử dụng cho cả phụ huynh và giáo
                viên.
              </li>
            </ul>
          </section>
        </div>

        {/* Cột phải: blog hoặc hình ảnh */}
        <div className="md:col-span-3 space-y-6">
          {/* Nếu có API blog */}
          {/* <BlogSidebar /> */}

          {/* Nếu chưa có thì dùng ảnh demo */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://giasumacdinhchi.vn/wp-content/uploads/2021/07/Untitled-design-15-1.png"
              alt="Hình ảnh kết nối toàn cầu"
              className="w-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img
              src="/images/study-2.jpg"
              alt="Đội ngũ phát triển"
              className="w-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img
              src="/images/study-3.jpg"
              alt="Nền tảng kết nối học viên với gia sư trực tuyến"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
