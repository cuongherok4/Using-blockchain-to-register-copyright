'use client'
// Chỉ thị cho Next.js rằng component này sẽ được render phía client

import React, { useEffect } from 'react';
// Import React và hook useEffect để xử lý side-effect

import Header from '../../components/Header';
// Import component Header từ thư mục components (hiển thị phần đầu trang)

import CreateNFT from '../../components/List';
// Import component CreateNFT – trong trường hợp này file `List.tsx` là nơi chứa form tạo NFT (có thể nên đổi tên file cho rõ ràng hơn)

import { connectWallet } from '../../../utils/ethers';
// Import hàm connectWallet để kết nối ví Metamask

const Create: React.FC = () => {
  // Khai báo component Create, sử dụng kiểu React.FC (Function Component)

  useEffect(() => {
    connectWallet(); // Kết nối ví Metamask khi trang được tải
  }, []);
  // useEffect chỉ chạy một lần duy nhất khi component được mount

  return (
    <div>
      {/* Hiển thị phần Header với props connectWallet để có thể gọi lại từ Header nếu cần */}
      <Header connectWallet={connectWallet} />

      {/* Hiển thị phần giao diện tạo NFT */}
      <CreateNFT />
    </div>
  );
};

export default Create;
// Export component Create để Next.js có thể sử dụng nó làm trang `/create`
