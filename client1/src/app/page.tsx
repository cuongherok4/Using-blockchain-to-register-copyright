'use client' 
// Chỉ thị cho Next.js biết rằng file này là một component phía client (client-side rendering)

import React, { useEffect } from 'react';
// Import React và hook useEffect để thực thi hành động sau khi component được render

import Header from '../components/Header';
// Import component Header từ thư mục components

import NFTList from '../components/Home';
// Import component NFTList để hiển thị danh sách các NFT

import { connectWallet } from '../../utils/ethers';
// Import hàm connectWallet từ file ethers để kết nối ví Metamask

const Home: React.FC = () => {
  // Khai báo component Home sử dụng kiểu React Function Component

  useEffect(() => {
    connectWallet(); // Kết nối ví Metamask khi component được render lần đầu
  }, []);
  // useEffect chỉ chạy một lần khi component được mount (do dependency array rỗng [])

  return (
    <div>
      <Header connectWallet={connectWallet} />
      {/* Hiển thị Header và truyền connectWallet như một props để có thể gọi lại khi cần */}
      
      <NFTList />
      {/* Hiển thị danh sách các NFT của người dùng */}
    </div>
  );
};

export default Home;
// Export component Home để có thể sử dụng ở các nơi khác (ví dụ như trang chủ)
