import { Mail, Phone, MapPin } from "lucide-react";
import Title from "@components-ui/Title";

const Contact = () => {
  const contactInfo = [
    {
      id: 1,
      icon: <Mail size={40} className="text-blue-500" />,
      label: "Email",
      content: "doquoctien.developer@gmail.com",
    },
    {
      id: 2,
      icon: <Phone size={40} className="text-green-500" />,
      label: "Điện thoại",
      content: "0123456789",
    },
    {
      id: 3,
      icon: <MapPin size={40} className="text-red-500" />,
      label: "Địa chỉ",
      content: "613 Âu Cơ, P.Tân Phú, TP.HCM",
    },
  ];

  return (
    <div className="max-w-[var(--width-8xl)] mx-auto px-4 py-10 space-y-12">
      {/* ===== Phần 1: Thông tin liên hệ ===== */}
      <section className="text-center">
        <Title
          text="Liên hệ với chúng tôi"
          size="2xl"
          className="mb-8 font-poppins"
          align="center"
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {contactInfo.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
              <p className="text-gray-700">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Phần 2: Bản đồ ===== */}
      <section>
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3519983737297!2d106.63908507490792!3d10.78432938936495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eb1cd7d4e49%3A0x411ab56b2abeaf38!2zNjEzIMSQLiDDgnUgQ8ahLCBQaMO6IFRydW5nLCBUw6JuIFBow7osIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCA3MDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1761538606079!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
