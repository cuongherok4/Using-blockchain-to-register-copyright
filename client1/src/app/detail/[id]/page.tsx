"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ethers } from "ethers";
import Link from "next/link";
import AcademicNFTABI from "../../../../abi/AcademicNFTABI.json";

const AcademicNFTAddress = "0x3AbE9ffe34F2b64eD7C2ccC41B76A3dF0cf6C59d";

interface NFT {
  id: string;
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  name: string;
  masv: string;
}

const NFTDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id?.toString();
  const [nft, setNft] = useState<NFT | null>(null);
  const [relatedNFTs, setRelatedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");
    setIsAuthenticated(auth);
    setUsername(name);
    setRole(userRole);
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (!id) {
        setMessage("ID không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(AcademicNFTAddress, AcademicNFTABI.abi, signer);
        const address = await signer.getAddress();

        const nftData = await contract.getNFTDetail(id);
        let metadata = {};
        if (nftData.uri) {
          let normalizedUri = nftData.uri.trim();
          if (normalizedUri.match(/^Qm[a-zA-Z0-9]{44}$/)) {
            normalizedUri = `https://coral-careful-reptile-773.mypinata.cloud/ipfs/${normalizedUri}`;
          }
          try {
            const response = await fetch(normalizedUri);
            if (response.ok) {
              metadata = await response.json();
            }
          } catch (error) {
            console.error(`Lỗi tải metadata từ URI: ${normalizedUri}`, error);
          }
        }

        setNft({ ...nftData, metadata });

        const userNFTs = await contract.getUserNFTs(address);
        setRelatedNFTs(userNFTs.filter((item: any) => item.id.toString() !== id));
      } catch (error) {
        console.error(error);
        setMessage("Đã có lỗi xảy ra khi lấy thông tin NFT.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTDetails();
  }, [id]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleDownload = async (uri: string, fileName: string) => {
    try {
      let normalizedUri = uri.trim();
      if (normalizedUri.match(/^Qm[a-zA-Z0-9]{44}$/)) {
        normalizedUri = `https://coral-careful-reptile-773.mypinata.cloud/ipfs/${normalizedUri}`;
      }
      if (
        !normalizedUri ||
        (!normalizedUri.startsWith("https://coral-careful-reptile-773.mypinata.cloud/ipfs/") &&
          !normalizedUri.match(/^Qm[a-zA-Z0-9]{44}$/))
      ) {
        throw new Error("URL không hợp lệ hoặc không phải CID/Pinata hợp lệ.");
      }

      const response = await fetch(normalizedUri, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get("Content-Type") || "application/octet-stream";
      const blob = await response.blob();
      let extension = ".bin";
      if (contentType.includes("pdf")) extension = ".pdf";
      else if (contentType.includes("image")) extension = ".jpg";
      else if (contentType.includes("text")) extension = ".txt";
      else if (contentType.includes("zip")) extension = ".zip";

      const finalFileName = `${fileName.replace(/[^a-zA-Z0-9]/g, "_")}${extension}`;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error("Lỗi khi tải file:", error);
      setMessage(error.message || "Đã xảy ra lỗi khi tải file.");
    }
  };

  const navItems = [
    { href: "/", label: "Trang chủ", icon: "🏠" },
    { href: "/list", label: "Danh sách chờ", icon: "⏳" },
    { href: "/create", label: "Quản lý tài khoản", icon: "👥" },
    { href: "/list_blockchain", label: "Danh sách đã lưu", icon: "💾" },
    { href: "/thongke", label:"Thống kê",icon:"💾"}
  ];

  if (isLoadingAuth) {
    return (
      <div className="w-full h-20 bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse"></div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">Đang tải thông tin NFT...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
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
                  <h1 className="text-xs font-medium tracking-wider opacity-90 uppercase">Trường Đại học</h1>
                  <h2 className="text-lg font-bold tracking-tight">Công Nghệ Đông Á</h2>
                </div>
              </div>
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
        <nav className="hidden md:block bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center space-x-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center space-x-2 px-5 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 text-center mb-8 animate-in slide-in-from-top duration-700">
          Chi Tiết NFT
        </h1>
        {message && (
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-center text-red-500 font-medium animate-in fade-in-50 duration-300">{message}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: NFT Information and Related NFTs */}
          <div className="space-y-8">
            {nft ? (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in-50 duration-700 delay-200">
                <h2 className="text-2xl font-bold text-indigo-800 mb-6">Thông tin NFT</h2>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Tiêu đề:</strong> {nft.title}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Năm học:</strong> {nft.academicYear}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Khoa:</strong> {nft.department}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Tên tác giả:</strong> {nft.name}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Mã sinh viên:</strong> {nft.msv}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-indigo-600">Metadata:</strong>{" "}
                    <button
                      onClick={() => window.open(nft.uri, "_blank", "noopener,noreferrer")}
                      className="text-indigo-600 hover:underline"
                    >
                      Xem file
                    </button>
                    {nft.uri && (
                      <button
                        onClick={() => handleDownload(nft.uri, nft.title)}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        Tải về
                      </button>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-medium text-center animate-in fade-in-50 duration-300">
                Không tìm thấy thông tin NFT.
              </p>
            )}

            {/* Related NFTs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 duration-700 delay-300">
              <h2 className="text-xl font-bold text-indigo-800 p-6">NFT liên quan</h2>
              <div className="relative overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Tiêu đề</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Năm học</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Khoa</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedNFTs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          Không có NFT liên quan nào.
                        </td>
                      </tr>
                    ) : (
                      relatedNFTs.map((relatedNFT, index) => (
                        <tr
                          key={relatedNFT.id}
                          className={`border-b border-gray-100 hover:bg-indigo-50/50 transition-colors duration-200 animate-in fade-in-50 duration-500 delay-${index * 100}`}
                        >
                          <td className="px-6 py-4 text-gray-700">{relatedNFT.title}</td>
                          <td className="px-6 py-4 text-gray-700">{relatedNFT.academicYear}</td>
                          <td className="px-6 py-4 text-gray-700">{relatedNFT.department}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => window.open(`/detail/${relatedNFT.id}`, "_blank", "noopener,noreferrer")}
                              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: PDF Viewer */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in-50 duration-700 delay-200">
            <h2 className="text-xl font-bold text-indigo-800 mb-6">Nội dung tài liệu</h2>
            {nft && nft.uri ? (
              <embed
                src={nft.uri}
                type="application/pdf"
                className="w-full h-[750px] rounded-lg border border-gray-200"
              />
            ) : (
              <p className="text-red-500 font-medium text-center">Không thể tải file PDF.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;