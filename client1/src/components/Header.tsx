// "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    setIsAuthenticated(auth);
    setUsername(name);
    setRole(userRole);
    setIsLoadingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (isLoadingAuth) {
    return (
      <div className="w-full h-20 bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse"></div>
    );
  }

  const navItems = [
    { href: "/", label: "Trang chủ", icon: "🏠" },
    { href: "/list", label: "Danh sách chờ", icon: "⏳" },
    { href: "/create", label: "Quản lý tài khoản", icon: "👥" },
    { href: "/list_blockchain", label: "Danh sách đã lưu", icon: "💾" },
     { href: "/thongke", label: "Thống kê", icon: "💾" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and University Info */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_%C4%90%C3%B4ng_%C3%81_2015.png"
                  alt="Logo"
                  className="w-14 h-14 rounded-full border-2 border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xs font-medium tracking-wider opacity-90 uppercase">
                  Trường Đại học
                </h1>
                <h2 className="text-lg font-bold tracking-tight">
                  Công Nghệ Đông Á
                </h2>
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="relative px-5 py-2 bg-white text-indigo-600 font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium">{username}</div>
                      <div className="text-xs opacity-80">{role}</div>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in-10 slide-in-from-top-2 duration-200">
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {username?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{username}</div>
                            <div className="text-xs text-gray-600">{role}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium text-sm">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center space-x-2 px-5 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-4 py-2 text-gray-600">
                  <div className="w-7 h-7 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{username}</div>
                    <div className="text-xs">{role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium text-sm">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block mx-4 mt-2 px-4 py-3 bg-indigo-600 text-white text-center font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;