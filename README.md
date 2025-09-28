# Ứng dụng Blockchain trong Quản lý Quyền Tác Giả  

## 📌 Giới thiệu  
Ứng dụng blockchain để quản lý bản quyền cho đồ án, đề tài nghiên cứu khoa học.  

---

## 🛠️ Công nghệ sử dụng  
- Backend: NestJS  
- Frontend: NextJS  
- Blockchain: Solidity, Hardhat  
- Database: MySQL  
- Authentication: MetaMask, JWT  

---

## ⚙️ Kiến trúc hệ thống  
📷 *Sơ đồ kiến trúc hệ thống*  
![System Architecture](./images/architecture.png)

---

## 📂 Các chức năng chính  

### 👩‍🎓 Sinh viên  
- Đăng ký bản quyền đồ án/đề tài  
- Tra cứu đề tài đã đăng ký  

### 👨‍🏫 Admin  
- Quản lý tài khoản sinh viên  
- Duyệt / từ chối đề tài  
- Thống kê, xuất báo cáo  

📷 *Use Case Diagram*  
![Use Case](./images/usecase.png)

---

## 📊 Cơ sở dữ liệu  
📷 *Sơ đồ ERD*  
![Database ERD](./images/erd.png)

---

## 🖥️ Giao diện người dùng  

### 🔑 Đăng nhập  
![Login Page](./images/login.png)  

### 📑 Quản lý đề tài  
![Project Management](./images/project.png)  

### 📊 Thống kê  
![Statistics](./images/statistics.png)  

---

## ✅ Cách triển khai  
```bash
# Backend
cd backend
npm install
npm run start

# Frontend
cd frontend
npm install
npm run dev

# Deploy smart contract
cd contracts
npx hardhat run scripts/deploy.js --network localhost
