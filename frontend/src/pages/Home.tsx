import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Trang Chính</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Thẻ nội dung mẫu */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Thông Tin Cá Nhân</h2>
            <p className="text-gray-600">Xem và cập nhật thông tin cá nhân của bạn.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Thống Kê Blockchain</h2>
            <p className="text-gray-600">Xem thống kê chi tiết về NFT trên blockchain.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Hỗ Trợ</h2>
            <p className="text-gray-600">Liên hệ với chúng tôi để được hỗ trợ.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;