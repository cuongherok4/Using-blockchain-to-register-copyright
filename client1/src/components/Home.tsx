// "use client";

import React from "react";
import Link from "next/link";

const Homepage: React.FC = () => {
  const features = [
    {
      icon: "📝",
      title: "Đăng ký quyền tác giả dễ dàng",
      description: "Nộp đề tài nghiên cứu và đăng ký quyền tác giả chỉ với vài bước đơn giản trên hệ thống trực tuyến.",
    },
    {
      icon: "🔒",
      title: "Bảo vệ bản quyền an toàn",
      description: "Sử dụng công nghệ blockchain để đảm bảo tính minh bạch và an toàn cho các đề tài đã đăng ký.",
    },
    {
      icon: "🔍",
      title: "Quản lý đề tài hiệu quả",
      description: "Theo dõi trạng thái đề tài, nhận thông báo và quản lý tất cả các đăng ký của bạn ở một nơi.",
    },
    {
      icon: "🤝",
      title: "Hỗ trợ từ chuyên gia",
      description: "Nhận tư vấn từ đội ngũ chuyên gia của trường để hoàn thiện hồ sơ quyền tác giả.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080/1E3A8A/FFFFFF?text=Hero+Background')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 animate-in slide-in-from-top duration-700">
              HỆ THỐNG ĐĂNG KÝ<br className="hidden md:block" />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                QUYỀN TÁC GIẢ
              </span>
            </h1>
            <p className="text-lg md:text-xl opacity-95 mb-8 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-top duration-700 delay-150">
              Nền tảng dành cho sinh viên Trường Đại học Công nghệ Đông Á để đăng ký và bảo vệ quyền tác giả cho các đề tài nghiên cứu sáng tạo.
            </p>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tại sao chọn hệ thống của chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đơn giản hóa quy trình đăng ký và bảo vệ quyền tác giả cho sinh viên
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x600/1F2937/374151?text=CTA+Background')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Sẵn sàng <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                đăng ký đề tài
              </span>?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              Xem danh sách các đề tài đã đăng ký và bắt đầu hành trình bảo vệ quyền tác giả của bạn ngay hôm nay.
            </p>
            <Link
              href="/list_blockchain"
              className="group relative px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-black rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Xem Danh Sách Đề Tài</span>
              <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-10 w-40 h-40 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/2 right-20 w-60 h-60 bg-white/3 rounded-full animate-bounce delay-500"></div>
      </section>
    </div>
  );
};

export default Homepage;