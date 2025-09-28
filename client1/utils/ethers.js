import { ethers } from 'ethers';
// Import thư viện `ethers.js` dùng để tương tác với blockchain Ethereum

export const connectWallet = async () => { // Hàm bất đồng bộ `connectWallet` để kết nối ví người dùng
  try {
    if (typeof window.ethereum !== 'undefined') { 
      // Kiểm tra xem trình duyệt có tích hợp `window.ethereum` (ví dụ: MetaMask) hay không

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Tạo một provider từ MetaMask để kết nối tới blockchain Ethereum

      await provider.send("eth_requestAccounts", []);
      // Gửi yêu cầu yêu cầu người dùng cấp quyền truy cập ví (hiển thị popup MetaMask)

      const signer = provider.getSigner();
      // Lấy signer - đối tượng đại diện cho tài khoản đang đăng nhập (dùng để ký giao dịch)

      console.log('Wallet connected:', await signer.getAddress());
      // In địa chỉ ví được kết nối ra console
    } else {
      alert('Please install MetaMask!');
      // Nếu không có MetaMask hoặc trình duyệt không hỗ trợ `window.ethereum`, hiển thị thông báo
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    // Nếu có lỗi xảy ra khi kết nối, in lỗi ra console

    alert('An error occurred while connecting to the wallet. Please check the console for more details.');
    // Thông báo lỗi cho người dùng
  }
};
