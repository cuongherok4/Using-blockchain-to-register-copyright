//src/components/Navbar.tsx
import React, { useState, MouseEvent, CSSProperties } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios"; 

// Styles
const navbarStyle: CSSProperties = {
  background: "linear-gradient(to right, #1e3a8a, #3b82f6, #1e3a8a)",
  padding: "20px 32px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  position: "relative",
  zIndex: 10,
};

const containerStyle: CSSProperties = {
  maxWidth: "80rem",
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
};

const titleStyle: CSSProperties = {
  color: "transparent",
  fontSize: "1.75rem",
  fontWeight: "700",
  letterSpacing: "0.06em",
  background: "linear-gradient(to right, #ffffff, #dbeafe)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  transition: "transform 0.3s ease",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  userSelect: "none",
  flexShrink: 0, // không bị co lại khi màn hình nhỏ
};

const linksContainerStyle: CSSProperties = {
  display: "flex",
  gap: "1.25rem",
  marginTop: "8px",
  alignItems: "center",
  flexGrow: 1, // cho phần links chiếm hết khoảng trống
  flexWrap: "wrap",
};

const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: "10px 20px",
  borderRadius: "50px",
  fontWeight: 600,
  color: isActive ? "#1e3a8a" : "white",
  textDecoration: "none" as const,
  transition: "all 0.3s ease, transform 0.2s ease",
  backgroundColor: isActive ? "#ffffff" : "transparent",
  boxShadow: isActive ? "0 3px 8px rgba(0, 0, 0, 0.2)" : "none",
  transform: isActive ? "scale(1.05)" : "scale(1)",
  whiteSpace: "nowrap", // tránh xuống dòng link
});

const profileButtonStyle: CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3b82f6, #1e40af)",
  border: "2px solid white",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontWeight: "700",
  fontSize: "1.25rem",
  userSelect: "none",
  transition: "box-shadow 0.3s ease",
  flexShrink: 0,
};

const profileButtonHoverStyle = {
  boxShadow: "0 0 10px 3px rgba(59, 130, 246, 0.7)",
};

const profilePopupStyle: CSSProperties = {
  position: "absolute",
  top: "60px",
  right: "0",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  padding: "1rem",
  width: "250px",
  zIndex: 20,
  color: "#1e3a8a",
  userSelect: "none",
};

const profileNameStyle: CSSProperties = {
  fontWeight: "700",
  fontSize: "1.1rem",
  marginBottom: "0.5rem",
};

const profileEmailStyle: CSSProperties = {
  fontSize: "0.9rem",
  color: "#334155",
  marginBottom: "1rem",
};

const profileLogoutButtonStyle: CSSProperties = {
  padding: "0.5rem 0",
  width: "100%",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #ef4444, #f87171)",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease, transform 0.2s ease",
};

const handleMouseEnter = (
  e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
) => {
  if (!e.currentTarget.className.includes("active")) {
    e.currentTarget.style.background =
      e.currentTarget.tagName === "BUTTON"
        ? "linear-gradient(90deg, #f87171, #ef4444)"
        : "#ffffff";
    e.currentTarget.style.color =
      e.currentTarget.tagName === "BUTTON" ? "white" : "#1e3a8a";
    e.currentTarget.style.transform = "scale(1.1)";
    e.currentTarget.style.boxShadow = "0 5px 12px rgba(0, 0, 0, 0.3)";
  }
};

const handleMouseLeave = (
  e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
) => {
  if (!e.currentTarget.className.includes("active")) {
    e.currentTarget.style.background =
      e.currentTarget.tagName === "BUTTON"
        ? "linear-gradient(90deg, #ef4444, #f87171)"
        : "transparent";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow =
      e.currentTarget.tagName === "BUTTON"
        ? "0 3px 8px rgba(0, 0, 0, 0.2)"
        : "none";
  }
};

const handleNavbarHover = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
};

const handleNavbarLeave = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
};

const handleTitleHover = (e: MouseEvent<HTMLHeadingElement>) => {
  e.currentTarget.style.transform = "scale(1.05)";
};

const handleTitleLeave = (e: MouseEvent<HTMLHeadingElement>) => {
  e.currentTarget.style.transform = "scale(1)";
};

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.setItem("isAuthenticated", "false"); // Thêm dòng này
  window.dispatchEvent(new Event("storageChange"));
  navigate("/login");
};


  const toggleProfile = async () => {
    const newState = !showProfile;
    setShowProfile(newState);

    if (newState && !user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin cá nhân:", err);
        navigate("/login");
      }
    }
  };

  return (
    <nav
      style={navbarStyle}
      onMouseEnter={handleNavbarHover}
      onMouseLeave={handleNavbarLeave}
    >
      <div style={containerStyle}>
        <h1
          style={titleStyle}
          onMouseEnter={handleTitleHover}
          onMouseLeave={handleTitleLeave}
        >
          🎓 Quản Lý Đề Tài
        </h1>

        <div style={linksContainerStyle}>
          <NavLink to="/" style={getNavLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            📦 Blockchain
          </NavLink>
          <NavLink to="/send-request" style={getNavLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            📨 Gửi Yêu Cầu
          </NavLink>
          <NavLink to="/sent-requests" style={getNavLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            🗂 Đã Gửi
          </NavLink>
        </div>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            aria-label="Thông tin cá nhân"
            onClick={toggleProfile}
            style={profileButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = profileButtonHoverStyle.boxShadow)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            👤
          </button>

          {showProfile && (
            <div style={profilePopupStyle}>
              <div style={profileNameStyle}>{user?.name || "Đang tải..."}</div>
              <div style={profileEmailStyle}>{user?.email || ""}</div>
              <button style={profileLogoutButtonStyle} onClick={handleLogout}>
                🚪 Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;