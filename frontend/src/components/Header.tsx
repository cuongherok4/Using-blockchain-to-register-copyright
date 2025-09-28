// src/components/Header.tsx
import { useState } from "react";

const Header = () => {
  const [showInfo, setShowInfo] = useState(false);

  const email = localStorage.getItem("email") || "Chưa đăng nhập";

  return (
    <header style={{ display: "flex", alignItems: "center", padding: "1rem", backgroundColor: "#1e40af", color: "#fff" }}>
      <div style={{ cursor: "pointer" }} onClick={() => setShowInfo(!showInfo)}>
        <img src="/logo.png" alt="Logo" style={{ width: "40px", height: "40px" }} />
      </div>

      {showInfo && (
        <div style={{
          position: "absolute",
          top: "60px",
          left: "10px",
          backgroundColor: "#fff",
          color: "#1e40af",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          <p>Email: {email}</p>
          <p>Tên người dùng: {/* nếu có lưu thêm tên */}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
