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
