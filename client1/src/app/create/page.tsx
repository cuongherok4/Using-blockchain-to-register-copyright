'use client'

import React, { useState, useEffect } from 'react'; // Nhập các hook React: useState và useEffect
import Header from '../../components/Header' // Nhập component Header từ thư mục components
import CreateNFT from '../../components/Accounts'; // Nhập component CreateNFT từ thư mục components
import { connectWallet } from '../../../utils/ethers'; // Nhập hàm connectWallet từ thư mục utils để kết nối ví

const Create: React.FC = () => {
  const [loading, setLoading] = useState(false); // Khởi tạo state 'loading' để quản lý trạng thái đang tải (kết nối ví)

  useEffect(() => {
    const connect = async () => {
      setLoading(true); // Khi bắt đầu kết nối ví, chuyển trạng thái loading sang true
      try {
        await connectWallet(); // Gọi zhàm connectWallet để kết nối ví
      } catch (error) {
        console.error('Error connecting wallet:', error); // Nếu có lỗi, in ra lỗi kết nối ví
      } finally {
        setLoading(false); // Sau khi kết nối xong (thành công hay thất bại), đổi trạng thái loading về false==
      }
    };
    connect(); // Gọi hàm connect khi component được render lần đầu tiên
  }, []); // Mảng dependency rỗng [] đảm bảo useEffect chỉ chạy một lần khi component được mount

  return (
    <div> 
      <Header connectWallet={connectWallet} /> {/* Hiển thị Header, truyền hàm connectWallet vào component Header */}
      {loading ? <p>Loading...</p> : <CreateNFT />} {/* Nếu đang loading, hiển thị "Loading..."; nếu không, hiển thị component CreateNFT */}
    </div>
  );
};

export default Create; // Xuất component Create để sử dụng trong các phần khác của ứng dụng
