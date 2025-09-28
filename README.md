# Ứng dụng Blockchain trong Quản lý Quyền Tác Giả  

## 📌 Giới thiệu  
Ứng dụng blockchain để quản lý bản quyền cho đồ án và đề tài nghiên cứu khoa học.  
Mục tiêu:  
- Đăng ký, xác thực và tra cứu bản quyền minh bạch.  
- Hạn chế đạo văn, trùng lặp đề tài.  
- Bảo đảm quyền sở hữu trí tuệ nhờ blockchain.  

---

## 🛠️ Công nghệ sử dụng  
- Backend: NestJS  
- Frontend: NextJS  
- Blockchain: Solidity, Hardhat  
- Database: MySQL  
- Authentication: MetaMask, JWT  
- Testing: Postman  

---

## ⚙️ Kiến trúc hệ thống  
Hệ thống gồm 3 thành phần chính:  
1. **Frontend (NextJS):** giao diện cho sinh viên & admin.  
2. **Backend (NestJS):** xử lý nghiệp vụ, kết nối blockchain & cơ sở dữ liệu.  
3. **Smart Contract (Solidity):** ghi nhận dữ liệu bất biến trên Ethereum.  

---

## 📂 Các chức năng chính  

### 👩‍🎓 Sinh viên  
- Đăng ký bản quyền đồ án/đề tài.  
- Quản lý hồ sơ cá nhân.  
- Tra cứu đề tài đã duyệt và đã đăng ký.  

### 👨‍🏫 Admin  
- Quản lý tài khoản sinh viên.  
- Duyệt / từ chối đề tài.  
- Thống kê, xuất báo cáo.  

---

## 📊 Cơ sở dữ liệu  
- Lưu trữ thông tin ngoài chuỗi bằng MySQL.  
- Blockchain lưu hash + timestamp để đảm bảo tính bất biến.  

---

## 🖥️ Giao diện người dùng  
- Đăng nhập / quên mật khẩu.  
- Trang chủ.  
- Quản lý đề tài.  
- Quản lý tài khoản sinh viên (Admin).  
- Thống kê báo cáo.  

---

## ✅ Cách triển khai  

### Backend
```bash
cd backend
npm install
npm run start

## 🌐 Tạo mạng ảo và kết nối MetaMask – Ganache

### 1. Lý thuyết cơ bản
- **Ganache**: công cụ giả lập mạng Ethereum trên máy tính, cho phép tạo blockchain ảo để phát triển và kiểm thử smart contract.  
- **MetaMask**: ví tiền điện tử, dùng để quản lý tài khoản, ký giao dịch và kết nối dApp với blockchain.  
- **RPC (Remote Procedure Call)**: địa chỉ để ứng dụng (frontend/backend) giao tiếp với mạng blockchain.  
- **Private Key**: khóa cá nhân để ký giao dịch → cần giữ bí mật tuyệt đối.  

---

### 2. Tạo mạng ảo bằng Ganache
Có 2 cách:

**A. Ganache GUI (dễ dùng)**
1. Cài Ganache GUI.  
2. Chọn **Quickstart (Ethereum)**.  
3. Ganache sẽ chạy mạng local tại `http://127.0.0.1:7545`, kèm 10 tài khoản test (đều có ETH ảo).  
4. Lưu lại **RPC URL** và **Chain ID** (thường là `1337` hoặc `5777`).  

**B. Ganache CLI**
```bash
npm install -g ganache   # cài đặt nếu chưa có
ganache -p 7545 -a 10    # khởi chạy trên cổng 7545, 10 account

