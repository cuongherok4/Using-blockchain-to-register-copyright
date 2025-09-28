'use client'

import React, { useState, useEffect } from 'react'; // Nhập các hook React: useState và useEffect
import Header from '../../components/Header' // Nhập component Header từ thư mục components
import CreateNFT from '../../components/List_blockchain'; // Nhập component CreateNFT từ thư mục components
import { connectWallet } from '../../../utils/ethers'; // Nhập hàm connectWallet từ thư mục utils để kết nối ví

const Create: React.FC = () => {
  const [loading, setLoading] = useState(false); // Khởi tạo state 'loading' để quản lý trạng thái đang tải (kết nối ví)



  return (
    <div> 
      <Header connectWallet={connectWallet} /> {/* Hiển thị Header, truyền hàm connectWallet vào component Header */}
      {loading ? <p>Loading...</p> : <CreateNFT />} {/* Nếu đang loading, hiển thị "Loading..."; nếu không, hiển thị component CreateNFT */}
    </div>
  );
};

export default Create; // Xuất component Create để sử dụng trong các phần khác của ứng dụng
