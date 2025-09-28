import { useState, useEffect, useMemo } from "react";

interface Request {
  id: number;
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  name: string;
  email?: string;
  masv?: string;
}

interface EditFormData {
  title: string;
  department: string;
  name: string;
  uri?: string;
}

interface SearchFilters {
  title: string;
  fromDate: string;
  toDate: string;
}

// Khóa Pinata JWT
const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YjcxNGYwMS0xNTc3LTRiNGItYjkwMC0wMWRjYmQ5Mjc4ZmQiLCJlbWFpbCI6ImN1b25naGVyb2s0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMGM1ZTVjMGQyYTM2NTk5NTQyZiIsInNjb3BlZEtleVNlY3JldCI6IjlkMDNmZDc1OTdkZjM2NGQ1MzBkMTY1MWNmYzRlOTBkZGUzNzJjY2QzYzgwMjg2NzMzNWNiYWQxYTliNWU3YjEiLCJleHAiOjE3Nzc1MzYxNjF9.vo1BhRZA0JsaP8AP0_Fn-BKfibmUTgzU7_YNmfnYEQ0";

const FilterSection: React.FC<{
  searchFilters: SearchFilters;
  handleSearchChange: (field: keyof SearchFilters, value: string) => void;
  handleResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}> = ({ searchFilters, handleSearchChange, handleResetFilters, filteredCount, totalCount }) => (
  <div
    style={{
      maxWidth: "80rem",
      width: "100%",
      backgroundColor: "#fff",
      padding: "0.75rem",
      borderRadius: "8px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
      marginBottom: "1rem",
      border: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem", // Tăng gap để tách các phần tử
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          color: "#2563eb",
          marginRight: "1rem", // Tăng khoảng cách với phần tiếp theo
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          flexShrink: 0,
        }}
      >
        🔍 Tìm kiếm và lọc
      </h3>
      <div style={{ flex: "1 1 250px", minWidth: "200px", marginRight: "1rem" }}> {/* Thêm marginRight để tách */}
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.2rem",
          }}
        >
          Tìm theo tiêu đề:
        </label>
        <input
          type="text"
          value={searchFilters.title}
          onChange={(e) => handleSearchChange("title", e.target.value)}
          placeholder="Nhập tiêu đề đề tài..."
          style={{
            width: "100%",
            padding: "0.4rem",
            border: "1px solid #d1d5db",
            borderRadius: "5px",
            fontSize: "0.85rem",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
      </div>
      <div style={{ maxWidth: "150px", flex: "0 1 auto", marginRight: "1rem" }}> {/* Thêm marginRight */}
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.2rem",
          }}
        >
          Từ ngày:
        </label>
        <input
          type="date"
          value={searchFilters.fromDate}
          onChange={(e) => handleSearchChange("fromDate", e.target.value)}
          style={{
            width: "100%",
            padding: "0.4rem",
            border: "1px solid #d1d5db",
            borderRadius: "5px",
            fontSize: "0.85rem",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
      </div>
      <div style={{ maxWidth: "150px", flex: "0 1 auto", marginRight: "1rem" }}> {/* Thêm marginRight */}
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.2rem",
          }}
        >
          Đến ngày:
        </label>
        <input
          type="date"
          value={searchFilters.toDate}
          onChange={(e) => handleSearchChange("toDate", e.target.value)}
          style={{
            width: "100%",
            padding: "0.4rem",
            border: "1px solid #d1d5db",
            borderRadius: "5px",
            fontSize: "0.85rem",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          flexShrink: 0,
          marginRight: "1rem", // Tách với nút
        }}
      >
        📊 Kết quả: <strong style={{ color: "#2563eb" }}>{filteredCount}</strong> / {totalCount} yêu cầu
      </div>
      <button
        onClick={handleResetFilters}
        style={{
          padding: "0.4rem 0.8rem",
          backgroundColor: "#6b7280",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "0.85rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          flexShrink: 0,
          marginLeft: "auto", // Giữ nút ở cuối
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4b5563")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6b7280")}
      >
        🔄 Xóa bộ lọc
      </button>
    </div>
  </div>
);

const EditForm: React.FC<{
  editFormData: EditFormData;
  handleFormChange: (field: keyof EditFormData, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateRequest: () => void;
  handleCancelEdit: () => void;
  selectedFile: File | null;
  uploading: boolean;
  isUpdating: boolean;
  uri?: string;
}> = ({
  editFormData,
  handleFormChange,
  handleFileChange,
  handleUpdateRequest,
  handleCancelEdit,
  selectedFile,
  uploading,
  isUpdating,
  uri,
}) => (
  <>
    <td style={{ padding: "1rem", color: "#1e3a8a", maxWidth: "200px" }}>
      <input
        type="text"
        value={editFormData.title}
        onChange={(e) => handleFormChange("title", e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      />
    </td>
    <td style={{ padding: "1rem", color: "#1e3a8a" }}>
      <input
        type="text"
        value={editFormData.department}
        onChange={(e) => handleFormChange("department", e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      />
    </td>
    <td style={{ padding: "1rem", color: "#1e3a8a" }}>
      <input
        type="text"
        value={editFormData.name}
        onChange={(e) => handleFormChange("name", e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      />
    </td>
    <td style={{ padding: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{
            fontSize: "0.8rem",
            padding: "0.3rem",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
          disabled={uploading}
        />
        {uploading && (
          <span style={{ fontSize: "0.8rem", color: "#059669" }}>
            🔄 Đang upload...
          </span>
        )}
        {selectedFile && !uploading && (
          <span style={{ fontSize: "0.8rem", color: "#059669" }}>
            ✅ File mới đã chọn
          </span>
        )}
        {!selectedFile && uri && (
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            📄 Giữ file hiện tại
          </span>
        )}
      </div>
    </td>
    <td style={{ padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={handleUpdateRequest}
          disabled={isUpdating || uploading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: isUpdating || uploading ? "#9ca3af" : "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: "500",
            cursor: isUpdating || uploading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {isUpdating ? "Đang lưu..." : uploading ? "Đang upload..." : "💾 Lưu"}
        </button>
        <button
          onClick={handleCancelEdit}
          disabled={isUpdating || uploading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: "500",
            cursor: isUpdating || uploading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          ❌ Hủy
        </button>
      </div>
    </td>
  </>
);

const RequestTable: React.FC<{
  filteredRequests: Request[];
  editingId: number | null;
  editFormData: EditFormData;
  handleFormChange: (field: keyof EditFormData, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateRequest: () => void;
  handleCancelEdit: () => void;
  handleEdit: (request: Request) => void;
  handleDeleteRequest: (id: number) => void;
  handleDownloadFile: (id: number) => void;
  formatDateTime: (dateString: string) => string;
  selectedFile: File | null;
  uploading: boolean;
  isUpdating: boolean;
  downloadingId: number | null;
  deletingId: number | null;
}> = ({
  filteredRequests,
  editingId,
  editFormData,
  handleFormChange,
  handleFileChange,
  handleUpdateRequest,
  handleCancelEdit,
  handleEdit,
  handleDeleteRequest,
  handleDownloadFile,
  formatDateTime,
  selectedFile,
  uploading,
  isUpdating,
  downloadingId,
  deletingId,
}) => (
  <div style={{ maxWidth: "100rem", width: "100%", overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <thead>
        <tr>
          {["ID", "Tiêu đề", "Thời gian gửi", "Khoa", "Tên", "Mã SV", "File tài liệu", "Thao tác"].map(
            (header) => (
              <th
                key={header}
                style={{
                  padding: "1rem",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderBottom: "2px solid #60a5fa",
                }}
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {filteredRequests.map((req, idx) => (
          <tr
            key={req.id}
            style={{
              backgroundColor: idx % 2 === 0 ? "#fff" : "#f0f7ff",
              borderBottom: idx === filteredRequests.length - 1 ? "none" : "1px solid #bfdbfe",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fff" : "#f0f7ff")
            }
          >
            <td style={{ padding: "1rem", color: "#2563eb", fontWeight: 500 }}>{req.id}</td>
            {editingId === req.id ? (
              <EditForm
                editFormData={editFormData}
                handleFormChange={handleFormChange}
                handleFileChange={handleFileChange}
                handleUpdateRequest={handleUpdateRequest}
                handleCancelEdit={handleCancelEdit}
                selectedFile={selectedFile}
                uploading={uploading}
                isUpdating={isUpdating}
                uri={req.uri}
              />
            ) : (
              <>
                <td style={{ padding: "1rem", color: "#1e3a8a", maxWidth: "200px" }}>
                  <div
                    style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={req.title}
                  >
                    {req.title}
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "#1e3a8a", fontSize: "0.9rem" }}>
                  {formatDateTime(req.academicYear)}
                </td>
                <td style={{ padding: "1rem", color: "#1e3a8a" }}>{req.department}</td>
                <td style={{ padding: "1rem", color: "#1e3a8a" }}>{req.name}</td>
                <td style={{ padding: "1rem", color: "#2563eb", fontWeight: 500 }}>{req.masv}</td>
                <td style={{ padding: "1rem" }}>
                  {req.uri ? (
                    <button
                      onClick={() => handleDownloadFile(req.id)}
                      disabled={downloadingId === req.id}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: downloadingId === req.id ? "#9ca3af" : "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        cursor: downloadingId === req.id ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (downloadingId !== req.id) {
                          e.currentTarget.style.backgroundColor = "#047857";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (downloadingId !== req.id) {
                          e.currentTarget.style.backgroundColor = "#059669";
                        }
                      }}
                    >
                      {downloadingId === req.id ? "Đang tải..." : "📄 Tải xuống"}
                    </button>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Không có file</span>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleEdit(req)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      disabled={deletingId === req.id}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: deletingId === req.id ? "#9ca3af" : "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        cursor: deletingId === req.id ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== req.id) {
                          e.currentTarget.style.backgroundColor = "#b91c1c";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== req.id) {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                        }
                      }}
                    >
                      {deletingId === req.id ? "Đang xóa..." : "🗑️ Xóa"}
                    </button>
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SentRequests = () => {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMasv, setCurrentMasv] = useState<string>("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    title: "",
    fromDate: "",
    toDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    department: "",
    name: "",
    uri: "",
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const filteredRequests = useMemo(() => {
    return allRequests.filter((req) => {
      if (
        searchFilters.title &&
        !req.title.toLowerCase().includes(searchFilters.title.toLowerCase())
      ) {
        return false;
      }

      if (searchFilters.fromDate || searchFilters.toDate) {
        try {
          let requestDate: Date;
          const dateString = req.academicYear;

          if (dateString.includes("T") || dateString.includes("Z")) {
            requestDate = new Date(dateString);
          } else if (dateString.includes("-") && dateString.includes(" ")) {
            requestDate = new Date(dateString.replace(" ", "T"));
          } else {
            requestDate = new Date(dateString);
          }

          if (isNaN(requestDate.getTime())) {
            return true;
          }

          if (searchFilters.fromDate) {
            const fromDate = new Date(searchFilters.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            requestDate.setHours(0, 0, 0, 0);
            if (requestDate < fromDate) {
              return false;
            }
          }

          if (searchFilters.toDate) {
            const toDate = new Date(searchFilters.toDate);
            toDate.setHours(23, 59, 59, 999);
            requestDate.setHours(23, 59, 59, 999);
            if (requestDate > toDate) {
              return false;
            }
          }
        } catch (error) {
          console.error("Error filtering by date:", error);
        }
      }

      return true;
    });
  }, [allRequests, searchFilters]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
        }

        const userResponse = await fetch("http://localhost:8000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("Không thể lấy thông tin người dùng!");
        }

        const userData = await userResponse.json();
        const userEmail = userData.data.email || "";
        const userMasv = userEmail.slice(0, 8);
        setCurrentMasv(userMasv);

        const response = await fetch("http://localhost:8000/blockchain/all_nft_db", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Không thể tải danh sách! (Status: ${response.status})`);
        }

        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Dữ liệu trả về không đúng định dạng.");
        }

        const filteredRequests = result.data
          .map((req: any) => ({
            ...req,
            masv: req.email?.slice(0, 8) || req.masv || "",
          }))
          .filter((req: any) => req.masv === userMasv);

        setAllRequests(filteredRequests);
      } catch (err: any) {
        console.error("Error fetching requests:", err);
        setError(err.message || "Lỗi khi tải danh sách. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDateTime = (dateString: string) => {
    try {
      let date: Date;
      if (dateString.includes("T") || dateString.includes("Z")) {
        date = new Date(dateString);
      } else if (dateString.includes("-") && dateString.includes(" ")) {
        date = new Date(dateString.replace(" ", "T"));
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Original:", dateString);
      return dateString;
    }
  };

  const handleSearchChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setSearchFilters({
      title: "",
      fromDate: "",
      toDate: "",
    });
  };

  const uploadFileToPinata = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: formDataFile,
      });

      if (!response.ok) {
        throw new Error(`Upload thất bại với mã ${response.status}`);
      }

      const data = await response.json();
      return `https://coral-careful-reptile-773.mypinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
      throw new Error(
        `Upload lỗi: ${error instanceof Error ? error.message : "Không xác định"}`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (request: Request) => {
    setEditingId(request.id);
    setEditFormData({
      title: request.title,
      department: request.department,
      name: request.name,
      uri: request.uri,
    });
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      title: "",
      department: "",
      name: "",
      uri: "",
    });
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
      return;
    }
    setSelectedFile(file || null);
  };

  const handleUpdateRequest = async () => {
    if (!editingId) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      let updateData = { ...editFormData };

      if (selectedFile) {
        try {
          const newUri = await uploadFileToPinata(selectedFile);
          updateData.uri = newUri;
        } catch (uploadError) {
          alert(
            "Lỗi khi upload file: " +
              (uploadError instanceof Error ? uploadError.message : "Không xác định")
          );
          return;
        }
      }

      const response = await fetch(
        `http://localhost:8000/blockchain/update-pending/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Không thể cập nhật! (Status: ${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        setAllRequests((prev) =>
          prev.map((req) => (req.id === editingId ? { ...req, ...updateData } : req))
        );
        handleCancelEdit();
        alert("Cập nhật thành công!");
      } else {
        throw new Error(result.message || "Cập nhật thất bại!");
      }
    } catch (err: any) {
      console.error("Error updating request:", err);
      alert(err.message || "Lỗi khi cập nhật. Vui lòng thử lại!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này không?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      const response = await fetch(`http://localhost:8000/blockchain/delete-pending/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Không thể xóa! (Status: ${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        setAllRequests((prev) => prev.filter((req) => req.id !== id));
        alert("Xóa thành công!");
      } else {
        throw new Error(result.message || "Xóa thất bại!");
      }
    } catch (err: any) {
      console.error("Error deleting request:", err);
      alert(err.message || "Lỗi khi xóa. Vui lòng thử lại!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadFile = async (id: number) => {
    setDownloadingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      const response = await fetch(`http://localhost:8000/blockchain/download_pending/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Không thể tải file! (Status: ${response.status})`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = `pending_${id}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          fileName = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading file:", err);
      alert(err.message || "Lỗi khi tải file. Vui lòng thử lại!");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFormChange = (field: keyof EditFormData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      style={{
        padding: "2.5rem 1.5rem",
        fontFamily: "'Inter', sans-serif",
        color: "#1e3a8a",
        backgroundColor: "#f0f7ff",
        minHeight: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <FilterSection
        searchFilters={searchFilters}
        handleSearchChange={handleSearchChange}
        handleResetFilters={handleResetFilters}
        filteredCount={filteredRequests.length}
        totalCount={allRequests.length}
      />
      {isLoading ? (
        <p
          style={{
            fontSize: "1.125rem",
            color: "#2563eb",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            borderRadius: "8px",
          }}
        >
          Đang tải dữ liệu...
        </p>
      ) : error ? (
        <p
          style={{
            fontSize: "1.125rem",
            color: "#b91c1c",
            padding: "1rem",
            backgroundColor: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fee2e2",
          }}
        >
          {error}
        </p>
      ) : allRequests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#2563eb",
              padding: "1rem",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Bạn chưa gửi yêu cầu nào.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
            {currentMasv ? `Không tìm thấy yêu cầu nào cho mã sinh viên: ${currentMasv}` : ""}
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#f59e0b",
              padding: "1rem",
              backgroundColor: "#fffbeb",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #fed7aa",
            }}
          >
            Không tìm thấy yêu cầu nào phù hợp với bộ lọc.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Thử điều chỉnh bộ lọc tìm kiếm hoặc xóa bộ lọc để xem tất cả yêu cầu.
          </p>
        </div>
      ) : (
        <RequestTable
          filteredRequests={filteredRequests}
          editingId={editingId}
          editFormData={editFormData}
          handleFormChange={handleFormChange}
          handleFileChange={handleFileChange}
          handleUpdateRequest={handleUpdateRequest}
          handleCancelEdit={handleCancelEdit}
          handleEdit={handleEdit}
          handleDeleteRequest={handleDeleteRequest}
          handleDownloadFile={handleDownloadFile}
          formatDateTime={formatDateTime}
          selectedFile={selectedFile}
          uploading={uploading}
          isUpdating={isUpdating}
          downloadingId={downloadingId}
          deletingId={deletingId}
        />
      )}
    </div>
  );
};

export default SentRequests;