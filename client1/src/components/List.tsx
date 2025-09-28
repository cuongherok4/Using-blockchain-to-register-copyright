// "use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import AcademicNFTABI from "../../abi/AcademicNFTABI.json";
// src/styles/List.css

const AcademicNFTAddress = "0x3AbE9ffe34F2b64eD7C2ccC41B76A3dF0cf6C59d";

interface Request {
  id: number;
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  name: string;
  masv: string;
}

const AllListedNFTs: React.FC = () => {
  const [listedTopics, setListedTopics] = useState<Request[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Request[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    name: "",
    academicYear: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Request | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog]);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/nfts");
      if (!response.ok) throw new Error("Không thể lấy dữ liệu từ API");
      const data = await response.json();
      console.log(
        "Dữ liệu từ API (uri kiểm tra):",
        data.map((item: Request) => ({ id: item.id, uri: item.uri }))
      );
      setListedTopics(data);
      setFilteredTopics(data);
    } catch (error) {
      console.error(error);
      setMessage("Đã có lỗi xảy ra khi lấy danh sách đề tài.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setFilteredTopics(
      listedTopics.filter(
        (topic) =>
          (value === "" ||
            (name === "name" &&
              topic.name.toLowerCase().includes(value.toLowerCase())) ||
            (name === "title" &&
              topic.title.toLowerCase().includes(value.toLowerCase())) ||
            (name === "academicYear" &&
              topic.academicYear
                .toLowerCase()
                .includes(value.toLowerCase()))) &&
          (filters.title === "" ||
            topic.title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.name === "" ||
            topic.name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (filters.academicYear === "" ||
            topic.academicYear
              .toLowerCase()
              .includes(filters.academicYear.toLowerCase()))
      )
    );
  };

  const handleDownload = async (uri: string, fileName: string) => {
    try {
      let normalizedUri = uri.trim();
      console.log("URI trước khi xử lý:", normalizedUri);

      if (normalizedUri.match(/^Qm[a-zA-Z0-9]{44}$/)) {
        normalizedUri = `https://coral-careful-reptile-773.mypinata.cloud/ipfs/${normalizedUri}`;
        console.log("URI sau khi ghép:", normalizedUri);
      }

      if (
        !normalizedUri ||
        (!normalizedUri.startsWith(
          "https://coral-careful-reptile-773.mypinata.cloud/ipfs/"
        ) &&
          !normalizedUri.match(/^Qm[a-zA-Z0-9]{44}$/))
      ) {
        throw new Error("URL không hợp lệ hoặc không phải CID/Pinata hợp lệ.");
      }

      const response = await fetch(normalizedUri, { method: "GET" });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("File không tồn tại trên Pinata.");
        } else if (response.status === 403) {
          throw new Error(
            "Không có quyền truy cập file. Có thể cần cấu hình CORS trên Pinata."
          );
        } else {
          throw new Error(
            `Lỗi HTTP: ${response.status} - ${response.statusText}`
          );
        }
      }

      const contentType =
        response.headers.get("Content-Type") || "application/octet-stream";
      const blob = await response.blob();

      let extension = ".bin";
      if (contentType.includes("pdf")) extension = ".pdf";
      else if (contentType.includes("image")) extension = ".jpg";
      else if (contentType.includes("text")) extension = ".txt";
      else if (contentType.includes("zip")) extension = ".zip";

      const finalFileName = `${fileName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}${extension}`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      alert("Tải file thành công!");
    } catch (error: any) {
      console.error("Lỗi khi tải file:", error);
      if (error.message.includes("Failed to fetch")) {
        alert(
          "Không thể tải file. Có thể do lỗi CORS hoặc mất kết nối mạng. Vui lòng kiểm tra console để biết chi tiết."
        );
      } else {
        alert(
          error.message ||
            "Đã xảy ra lỗi khi tải file. Vui lòng kiểm tra console để biết chi tiết."
        );
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đề tài này?")) return;
    try {
      const response = await fetch(`/api/nfts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Không thể xóa đề tài");
      const updatedTopics = listedTopics.filter((topic) => topic.id !== id);
      setListedTopics(updatedTopics);
      setFilteredTopics(updatedTopics);
      alert("Xóa đề tài thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đề tài:", error);
      alert("Đã xảy ra lỗi khi xóa đề tài. Vui lòng thử lại.");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      if (!window.ethereum) {
        throw new Error("Vui lòng cài đặt MetaMask để thực hiện duyệt.");
      }

      const topic = listedTopics.find((t) => t.id === id);
      if (!topic) {
        throw new Error("Không tìm thấy đề tài để duyệt.");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        AcademicNFTAddress,
        AcademicNFTABI.abi,
        signer
      );

      if (typeof contract.createNFT === "function") {
        const tx = await contract.createNFT(
          topic.title,
          topic.uri,
          topic.academicYear,
          topic.department,
          topic.name,
          topic.masv
        );
        setMessage(`Đang xử lý giao dịch duyệt cho đề tài ${id}...`);
        await tx.wait();
      } else {
        throw new Error(
          "Hàm createNFT không tồn tại trong smart contract. Vui lòng kiểm tra ABI."
        );
      }

      try {
        const response = await fetch(`/api/nfts/${id}`, { method: "DELETE" });
        if (!response.ok)
          throw new Error("Không thể cập nhật trạng thái đề tài");
        const updatedTopics = listedTopics.filter((t) => t.id !== id);
        setListedTopics(updatedTopics);
        setFilteredTopics(updatedTopics);
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đề tài:", error);
        setMessage(
          "NFT đã được tạo, nhưng không thể cập nhật trạng thái đề tài."
        );
        return;
      }

      setMessage(
        `Đề tài với ID ${id} đã được duyệt và NFT đã được tạo thành công!`
      );
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Lỗi khi duyệt đề tài:", error);
      setMessage(
        error.message ||
          "Đã xảy ra lỗi khi duyệt đề tài. Vui lòng kiểm tra console để biết chi tiết."
      );
    }
  };

  const handleShowDetails = (topic: Request) => setSelectedTopic(topic);
  const handleCloseModal = () => setSelectedTopic(null);

  if (loading)
    return (
      <p style={{ fontSize: "1rem", color: "#374151" }}>Đang tải dữ liệu...</p>
    );
  if (message && !selectedTopic && !showSuccessDialog)
    return <p style={{ fontSize: "1rem", color: "#ef4444" }}>{message}</p>;

  return (
    <div
      style={{
        padding: "40px",
        fontSize: "1.25rem",
        color: "#1e3a8a",
        background: "linear-gradient(to bottom, #ffffff, #f3f4f6)",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex justify-center"
          style={{
            animation: "slideDown 0.5s ease-out",
          }}
        >
          <div className="bg-green-500 text-white p-4 rounded-b-lg shadow-lg flex items-center justify-between max-w-lg w-full">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p>{message}</p>
            </div>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Slide-down animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <h2
  style={{
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "transparent",
    backgroundColor: "#1e3a8a",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center", // Thêm dòng này
  }}
>
  Danh Sách Đề Tài
</h2>

      {filteredTopics.length === 0 ? (
        <p style={{ fontSize: "1rem", color: "#374151" }}>
          Không có đề tài nào để hiển thị.
        </p>
      ) : (
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            overflowX: "auto",
          }}
        >
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Lọc theo tiêu đề"
              value={filters.title}
              onChange={handleFilterChange}
              style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            <input
              type="text"
              name="name"
              placeholder="Lọc theo tên"
              value={filters.name}
              onChange={handleFilterChange}
              style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            <input
              type="text"
              name="academicYear"
              placeholder="Lọc theo năm học"
              value={filters.academicYear}
              onChange={handleFilterChange}
              style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse" as const,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "12px",
                   backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Tiêu đề
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Năm học
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Khoa
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Tên
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Mã SV
                </th>
                <th
                  style={{
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    textAlign: "left" as const,
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr
                  key={topic.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "10px", color: "#1e3a8a" }}>
                    {topic.id}
                  </td>
                  <td style={{ padding: "10px", color: "#374151" }}>
                    {topic.title}
                  </td>
                  <td style={{ padding: "10px", color: "#374151" }}>
                    {topic.academicYear}
                  </td>
                  <td style={{ padding: "10px", color: "#374151" }}>
                    {topic.department}
                  </td>
                  <td style={{ padding: "10px", color: "#374151" }}>
                    {topic.name}
                  </td>
                  <td style={{ padding: "10px", color: "#374151" }}>
                    {topic.masv}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      color: "#374151",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => handleApprove(topic.id)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#10b981",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#059669")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#10b981")
                      }
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleShowDetails(topic)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2563eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3b82f6")
                      }
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#dc2626")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ef4444")
                      }
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedTopic && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "32rem",
              width: "100%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#1e3a8a",
              }}
            >
              Chi tiết đề tài
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div>
                <strong>Tên đề:</strong>{" "}
                <h2
                  style={{
                    display: "inline",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  {selectedTopic.title}
                </h2>
              </div>

              <p>
                <strong>Năm học:</strong> {selectedTopic.academicYear}
              </p>
              <p>
                <strong>Khoa:</strong> {selectedTopic.department}
              </p>
              <p>
                <strong>Tên sinh viên:</strong> {selectedTopic.name}
              </p>
              <p>
                <strong>Mã sinh viên:</strong> {selectedTopic.masv}
              </p>
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              {selectedTopic.uri && (
                <>
                  <button
                    onClick={() => window.open(selectedTopic.uri, "_blank")}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2563eb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3b82f6")
                    }
                  >
                    Truy cập
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(selectedTopic.uri, selectedTopic.title)
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d97706")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f59e0b")
                    }
                  >
                    Tải về
                  </button>
                </>
              )}

              <button
                onClick={handleCloseModal}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4b5563")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6b7280")
                }
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllListedNFTs;
