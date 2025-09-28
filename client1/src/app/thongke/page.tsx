"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ethers } from "ethers";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Địa chỉ contract
const AcademicNFTAddress = "0x3AbE9ffe34F2b64eD7C2ccC41B76A3dF0cf6C59d";

// ABI cho hàm getAllListedNFTs
const AcademicNFTABI = [
  {
    "inputs": [],
    "name": "getAllListedNFTs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "academicYear",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "department",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "masv",
            "type": "string"
          }
        ],
        "internalType": "struct AcademicNFT.NFT[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface BlockchainStats {
  totalNFTs: number;
  nftsByDepartment: Record<string, number>;
  nftsByMonth: Record<string, number>;
  nftsByYear: Record<string, number>;
  nftsByStudent: Record<string, number>;
  recentNFTs: any[];
  allNFTs: any[];
}

type ChartType = "department" | "student" | "month" | "year";
type ViewMode = "chart" | "table";

const ThongKeBlockchainPage: React.FC = () => {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State cho hiển thị và lọc
  const [chartType, setChartType] = useState<ChartType>("department");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  
  // State cho tìm kiếm và lọc
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [searchDepartment, setSearchDepartment] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>("");
  
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    if (!auth) {
      setError("Bạn cần đăng nhập để xem thống kê.");
      setLoading(false);
      return;
    }
    fetchBlockchainStats();
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        throw new Error("Vui lòng cài đặt MetaMask");
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error("Không có tài khoản nào được kết nối");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(AcademicNFTAddress, AcademicNFTABI, provider);

      console.log("Đang lấy dữ liệu từ contract...");

      const nfts = await contract.getAllListedNFTs();
      console.log("Dữ liệu NFT nhận được:", nfts);

      if (!nfts || nfts.length === 0) {
        setStats({
          totalNFTs: 0,
          nftsByDepartment: {},
          nftsByMonth: {},
          nftsByYear: {},
          nftsByStudent: {},
          recentNFTs: [],
          allNFTs: []
        });
        return;
      }

      const processedStats: BlockchainStats = {
        totalNFTs: nfts.length,
        nftsByDepartment: {},
        nftsByMonth: {},
        nftsByYear: {},
        nftsByStudent: {},
        recentNFTs: nfts.slice(-10).reverse(),
        allNFTs: nfts
      };

      nfts.forEach((nft: any) => {
        try {
          const dept = nft.department || 'Chưa phân loại';
          processedStats.nftsByDepartment[dept] = (processedStats.nftsByDepartment[dept] || 0) + 1;

          const student = nft.masv || 'Chưa có mã';
          processedStats.nftsByStudent[student] = (processedStats.nftsByStudent[student] || 0) + 1;

          if (nft.academicYear) {
            try {
              const nftDate = new Date(nft.academicYear);
              if (!isNaN(nftDate.getTime())) {
                const monthStr = `${nftDate.getFullYear()}-${(nftDate.getMonth() + 1).toString().padStart(2, '0')}`;
                const yearStr = nftDate.getFullYear().toString();

                processedStats.nftsByMonth[monthStr] = (processedStats.nftsByMonth[monthStr] || 0) + 1;
                processedStats.nftsByYear[yearStr] = (processedStats.nftsByYear[yearStr] || 0) + 1;
              }
            } catch (dateError) {
              console.warn("Lỗi xử lý ngày tháng cho NFT:", nft.id);
            }
          }

        } catch (err) {
          console.error("Lỗi xử lý NFT:", err);
        }
      });

      setStats(processedStats);
      console.log("Thống kê đã xử lý:", processedStats);

    } catch (err: any) {
      console.error("Lỗi chi tiết:", err);
      setError(err.message || "Lỗi khi tải dữ liệu từ blockchain");
    } finally {
      setLoading(false);
    }
  };

  // Lọc NFTs dựa trên các điều kiện tìm kiếm
  const filteredNFTs = useMemo(() => {
    if (!stats) return [];
    
    let filtered = stats.allNFTs;

    if (searchStudent.trim()) {
      filtered = filtered.filter(nft => 
        nft.masv && nft.masv.toLowerCase().includes(searchStudent.toLowerCase())
      );
    }

    if (searchDepartment.trim()) {
      filtered = filtered.filter(nft => 
        nft.department && nft.department.toLowerCase().includes(searchDepartment.toLowerCase())
      );
    }

    if (searchYear.trim()) {
      filtered = filtered.filter(nft => {
        if (!nft.academicYear) return false;
        return nft.academicYear.includes(searchYear);
      });
    }

    if (searchTitle.trim()) {
      filtered = filtered.filter(nft => 
        nft.title && nft.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    return filtered;
  }, [stats, searchStudent, searchDepartment, searchYear, searchTitle]);

  // Tạo dữ liệu cho biểu đồ dựa trên loại được chọn
  const chartData = useMemo(() => {
    if (!stats) return { labels: [], datasets: [] };

    const dataMap = {
      department: stats.nftsByDepartment,
      student: stats.nftsByStudent,
      month: stats.nftsByMonth,
      year: stats.nftsByYear
    };

    const data = dataMap[chartType];
    const labels = Object.keys(data);
    const values = Object.values(data);

    const getChartLabel = (type: ChartType) => {
      switch (type) {
        case 'department': return 'Số NFTs theo Khoa';
        case 'student': return 'Số NFTs theo Sinh viên';
        case 'month': return 'Số NFTs theo Tháng';
        case 'year': return 'Số NFTs theo Năm';
        default: return 'Số NFTs';
      }
    };

    return {
      labels: labels.slice(0, 20), // Giới hạn hiển thị 20 mục đầu
      datasets: [
        {
          label: getChartLabel(chartType),
          data: values.slice(0, 20),
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [stats, chartType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Phân bố NFTs theo ${chartType === 'department' ? 'Khoa' : chartType === 'student' ? 'Sinh viên' : chartType === 'month' ? 'Tháng' : 'Năm'}`,
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: "Số lượng" }
      },
      x: { 
        title: { display: true, text: chartType === 'department' ? 'Khoa' : chartType === 'student' ? 'Sinh viên' : chartType === 'month' ? 'Tháng' : 'Năm' }
      },
    },
  };

  const handleExportCSV = () => {
    if (!filteredNFTs.length) return;

    const headers = ["STT,Tiêu đề,Mã SV,Khoa,Năm học,Tên SV"];
    const rows = filteredNFTs.map((nft, index) => 
      `${index + 1},"${nft.title || 'N/A'}","${nft.masv || 'N/A'}","${nft.department || 'N/A'}","${nft.academicYear || 'N/A'}","${nft.name || 'N/A'}"`
    );

    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thongke_blockchain_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setSearchStudent("");
    setSearchDepartment("");
    setSearchYear("");
    setSearchTitle("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Đang tải dữ liệu từ blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={fetchBlockchainStats}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalNFTs === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Chưa có NFT nào trên blockchain</p>
          <button
            onClick={fetchBlockchainStats}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Thống Kê Blockchain NFTs
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi NFTs học thuật</p>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Tổng số NFTs</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalNFTs.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Số Khoa</h3>
            <p className="text-3xl font-bold text-green-600">
              {Object.keys(stats.nftsByDepartment).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Số Sinh viên</h3>
            <p className="text-3xl font-bold text-orange-600">
              {Object.keys(stats.nftsByStudent).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Kết quả lọc</h3>
            <p className="text-3xl font-bold text-purple-600">{filteredNFTs.length}</p>
          </div>
        </div>

        {/* Điều khiển */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-800">Chế độ xem:</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "chart" 
                      ? "bg-blue-600 text-white shadow" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Biểu đồ
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "table" 
                      ? "bg-blue-600 text-white shadow" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Bảng dữ liệu
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                disabled={filteredNFTs.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Xuất CSV ({filteredNFTs.length})
              </button>
              <button
                onClick={fetchBlockchainStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Làm mới
              </button>
            </div>
          </div>

          {/* Bộ lọc tìm kiếm */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc tìm kiếm</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm theo tiêu đề
                </label>
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Nhập tiêu đề đề tài..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm theo Mã SV
                </label>
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Nhập mã sinh viên..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm theo Khoa
                </label>
                <input
                  type="text"
                  value={searchDepartment}
                  onChange={(e) => setSearchDepartment(e.target.value)}
                  placeholder="Nhập tên khoa..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm theo Năm
                </label>
                <input
                  type="text"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  placeholder="VD: 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-blue-600">{filteredNFTs.length}</span> / {stats.totalNFTs} kết quả
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị nội dung chính */}
        {viewMode === "chart" ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Biểu đồ thống kê</h3>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="department">Theo Khoa</option>
                <option value="student">Theo Sinh viên</option>
                <option value="month">Theo Tháng</option>
                <option value="year">Theo Năm</option>
              </select>
            </div>
            <div style={{ height: '400px' }}>
              {chartType === "department" ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Danh sách NFTs ({filteredNFTs.length} kết quả)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên SV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm học</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNFTs.length > 0 ? (
                    filteredNFTs.map((nft, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate" title={nft.title}>
                          {nft.title || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {nft.masv || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nft.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {nft.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nft.academicYear || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => window.open(`/detail/${nft.id}`, "_blank", "noopener,noreferrer")}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📊</span>
                          </div>
                          <p className="text-lg font-medium mb-2">Không tìm thấy kết quả</p>
                          <p className="text-sm">Thử điều chỉnh bộ lọc tìm kiếm của bạn</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NFTs gần nhất */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            NFTs được tạo gần nhất ({stats.recentNFTs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentNFTs.map((nft, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2 truncate" title={nft.title}>
                  {nft.title || 'Chưa có tiêu đề'}
                </h4>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p><span className="font-medium">Mã SV:</span> {nft.masv || 'N/A'}</p>
                  <p><span className="font-medium">Khoa:</span> {nft.department || 'N/A'}</p>
                  <p><span className="font-medium">Năm:</span> {nft.academicYear || 'N/A'}</p>
                </div>
                <button
                  onClick={() => window.open(`/detail/${nft.id}`, "_blank", "noopener,noreferrer")}
                  className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKeBlockchainPage;