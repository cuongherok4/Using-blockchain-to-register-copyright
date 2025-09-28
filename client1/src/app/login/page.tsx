"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Email nhập vào:", email);
    console.log("Password nhập vào:", password);

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log("Kết quả từ backend:", result);

      if (res.ok) {
        alert(result.message || "Đăng nhập thành công!");

        // 📝 Lưu token + thông tin user
        localStorage.setItem("token", result.token || "");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", result.user?.name || email);
        localStorage.setItem("role", result.user?.role || "user");

        console.log("Token đã lưu:", result.token);

        router.push("/");
      } else {
        alert(result.error || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối tới server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}