// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleCanvas from "../components/ParticleCanvas";
import {
  containerStyle,
  canvasStyle,
  formStyle,
  titleStyle,
  inputGroupStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
  messageStyle,
} from "../styles/loginStyles";

interface LoginProps {
  updateAuthStatus: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

interface LoginResponse {
  statusCode: number;
  message: string;
  token: string;
  data: User;
}

const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || err.error || "Đăng nhập thất bại");
  }

  return res.json();
};

const Login: React.FC<LoginProps> = ({ updateAuthStatus }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!username || !password) {
      setMessage("Vui lòng nhập đầy đủ email và mật khẩu");
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginUser(username, password);
      console.log("Login result:", result);

      // Lưu token và thông tin user
      localStorage.setItem("token", result.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("email", result.data.email);
      localStorage.setItem("userId", result.data.id);
      localStorage.setItem("department", result.data.department);
      localStorage.setItem("role", result.data.role);

      // Cập nhật trạng thái login ở App.tsx
      updateAuthStatus();

      // Chuyển hướng về trang chính
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <ParticleCanvas style={canvasStyle} />
      <form style={formStyle} onSubmit={handleLogin}>
        <h2 style={titleStyle}>Đăng Nhập</h2>

        {message && (
          <div style={{ ...messageStyle, color: "red" }}>
            {message}
          </div>
        )}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
            placeholder="Nhập email"
          />
        </div>

        <div style={{ ...inputGroupStyle, position: "relative" }}>
          <label style={labelStyle}>Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, paddingRight: "2.5rem" }}
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#1e40af",
            }}
          >
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>

        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>
    </div>
  );
};

export default Login;
