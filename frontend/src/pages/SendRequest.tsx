//src/pages/SendRequest.tsx
import React, { useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu
interface FormData {
  title: string;
  uri: string;
  academicYear: string;
  department: string;
  name: string;
  masv: string;
}

interface Topic {
  id: string;
  title: string;
  name: string;
  msv?: string;
  status: string;
  uri?: string;
  academicYear: string;
  department: string;
  owner: string;
  [key: string]: any;
}

// Khóa Pinata JWT
const pinataJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YjcxNGYwMS0xNTc3LTRiNGItYjkwMC0wMWRjYmQ5Mjc4ZmQiLCJlbWFpbCI6ImN1b25naGVyb2s0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMGM1ZTVjMGQyYTM2NTk5NTQyZiIsInNjb3BlZEtleVNlY3JldCI6IjlkMDNmZDc1OTdkZjM2NGQ1MzBkMTY1MWNmYzRlOTBkZGUzNzJjY2QzYzgwMjg2NzMzNWNiYWQxYTliNWU3YjEiLCJleHAiOjE3Nzc1MzYxNjF9.vo1BhRZA0JsaP8AP0_Fn-BKfibmUTgzU7_YNmfnYEQ0";

// Hàm trích xuất văn bản từ PDF sử dụng pdf.js
const extractTextFromPDF = async (file: File | Blob): Promise<string> => {
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) {
    throw new Error(
      "pdf.js không được tải. Vui lòng kiểm tra script trong index.html."
    );
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= Math.min(pdf.numPages, 500); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + " ";
  }

  return text.trim();
};

// Hàm tính độ tương đồng đơn giản dựa trên số từ chung
const calculateSimilarity = (
  text1: string,
  text2: string,
  k: number = 3
): number => {
  // Chuẩn hóa văn bản: chuyển về chữ thường, loại bỏ ký tự đặc biệt, chuẩn hóa khoảng trắng
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, " ") // Chuẩn hóa khoảng trắng
      .trim();
  };

  // Tạo shingles: chia văn bản thành các tập hợp con gồm k từ liên tiếp
  const createShingles = (text: string, k: number): Set<string> => {
    const normalized = normalizeText(text);
    const words = normalized.split(" ");
    const shingles = new Set<string>();

    // Nếu số từ ít hơn k, trả về tập hợp chứa toàn bộ văn bản đã chuẩn hóa
    if (words.length < k) {
      if (normalized) shingles.add(normalized);
      return shingles;
    }

    // Tạo shingles bằng cách trượt cửa sổ k từ
    for (let i = 0; i <= words.length - k; i++) {
      const shingle = words.slice(i, i + k).join(" ");
      shingles.add(shingle);
    }
    return shingles;
  };

  // Chuẩn hóa và tạo shingles cho hai văn bản
  const shingles1 = createShingles(text1, k);
  const shingles2 = createShingles(text2, k);

  // Xử lý trường hợp một trong hai tập shingles rỗng
  if (shingles1.size === 0 || shingles2.size === 0) {
    return 0;
  }

  // Tính tập giao (intersection) và tập hợp (union) của shingles
  const array1 = Array.from(shingles1);
  const intersection = new Set(array1.filter((x) => shingles2.has(x)));
  const union = new Set([...array1, ...Array.from(shingles2)]);

  // Tính Jaccard Similarity và chuyển thành phần trăm
  const similarity = intersection.size / union.size;
  return isNaN(similarity) ? 0 : similarity * 100;
};

const SendRequest: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    uri: "",
    academicYear: "",
    department: "",
    name: "",
    masv: "",
  });

  const [user, setUser] = useState<{ name: string; department: string; academicYear: string; masv: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [duplicationPercentage, setDuplicationPercentage] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Kiểm tra token khi component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (!token) {
      setMessage('⚠️ Bạn cần đăng nhập để gửi yêu cầu.');
      setShowModal(true);
      return;
    }

    // Lấy thông tin user và điền vào form
    fetch("http://localhost:8000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Không thể lấy thông tin user');
        }
        return res.json();
      })
      .then(data => {
        const userData = data.data;
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || "",
          department: userData.department || "",
          academicYear: userData.academicYear || "",
          masv: userData.email?.slice(0, 8) || userData.masv || "",
        }));
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin user:", err);
        setMessage('⚠️ Lỗi xác thực. Vui lòng đăng nhập lại.');
        setShowModal(true);
      });
  }, []);

  // Lấy danh sách đề tài từ blockchain để kiểm tra trùng lặp
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:8000/blockchain/all_nft", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTopics(data.data.nfts || []);
        } else if (response.status === 401) {
          setMessage('⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setShowModal(true);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề tài:", error);
      }
    };

    fetchTopics();
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage("⚠️ File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
      setShowModal(true);
      return;
    }
    if (file) {
      setSelectedFile(file);
      setMessage(null);
      setDuplicationPercentage(null);
    }
  };

  const uploadFileToPinata = async (file: File): Promise<string> => {
    setUploading(true);
    setMessage(null);

    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
          },
          body: formDataFile,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload thất bại với mã ${response.status}`);
      }

      const data = await response.json();
      return `https://coral-careful-reptile-773.mypinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
      throw new Error(
        `❌ Upload lỗi: ${
          error instanceof Error ? error.message : "Không xác định"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const checkDuplication = async (file: File): Promise<number> => {
    try {
      const uploadedText = await extractTextFromPDF(file);
      let maxSimilarity = 0;

      console.log("Số lượng đề tài để so sánh:", topics.length);

      // Nếu không có đề tài nào để so sánh, trả về 0
      if (topics.length === 0) {
        console.log("Không có đề tài nào để so sánh");
        return 0;
      }

      for (const topic of topics) {
        if (topic.uri) {
          try {
            console.log(`Đang so sánh với đề tài: ${topic.title}`);
            const pdfResponse = await fetch(topic.uri);
            if (!pdfResponse.ok) {
              console.warn(`Không thể tải file từ ${topic.uri}`);
              continue;
            }
            
            const pdfBlob = await pdfResponse.blob();
            const topicText = await extractTextFromPDF(pdfBlob);
            const similarity = calculateSimilarity(uploadedText, topicText);
            console.log(`Độ tương đồng với "${topic.title}": ${similarity.toFixed(2)}%`);
            
            maxSimilarity = Math.max(maxSimilarity, similarity);
            
            // Nếu đã tìm thấy độ tương đồng cao, có thể dừng sớm
            if (maxSimilarity > 20) {
              break;
            }
          } catch (error) {
            console.warn(`Lỗi khi xử lý file từ ${topic.uri}:`, error);
          }
        }
      }

      console.log("Độ tương đồng cao nhất:", maxSimilarity);
      return maxSimilarity;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trùng lặp:", error);
      setMessage("⚠️ Lỗi khi trích xuất văn bản từ PDF. Vui lòng thử lại!");
      setShowModal(true);
      return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // KIỂM TRA TOKEN - BẢO VỆ QUAN TRỌNG
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('⚠️ Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      setShowModal(true);
      return;
    }

    // KIỂM TRA TIÊU ĐỀ TRÙNG LẶP
    const isTitleExist = topics.some(
      (topic) => topic.title.toLowerCase() === formData.title.toLowerCase()
    );

    if (isTitleExist) {
      setMessage("Đề tài đã được đăng ký trên blockchain");
      setShowModal(true);
      return;
    }

    // Kiểm tra file
    if (!selectedFile) {
      setMessage("⚠️ Vui lòng chọn file trước khi gửi yêu cầu.");
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Kiểm tra độ trùng lặp nội dung
      const duplication = await checkDuplication(selectedFile);
      setDuplicationPercentage(duplication);
      
      if (duplication > 20) {
        setMessage(
          `❌ KHÔNG THỂ GỬI: Độ trùng lặp nội dung quá cao (${duplication.toFixed(
            2
          )}%)\nNgưỡng cho phép: dưới 20%\nVui lòng chỉnh sửa nội dung và thử lại!`
        );
      } else {
        setMessage(
          `✅ ĐỦ ĐIỀU KIỆN: Độ trùng lặp nội dung: ${duplication.toFixed(
            2
          )}%\nMức độ trùng lặp chấp nhận được. Bạn có muốn gửi đề tài?`
        );
      }
      
      setShowModal(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "⚠️ Lỗi kết nối. Vui lòng kiểm tra server!"
      );
      setShowModal(true);
      setIsLoading(false);
    }
  };

  const proceedWithUpload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Lỗi xác thực. Vui lòng đăng nhập lại.');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      // Upload file lên Pinata
      const fullUri = await uploadFileToPinata(selectedFile!);
      setFormData((prev) => ({ ...prev, uri: fullUri }));

      // Gửi yêu cầu lên blockchain
      const response = await fetch("http://localhost:8000/blockchain/nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, uri: fullUri }),
      });

      if (response.ok) {
        setMessage("✅ Yêu cầu đã được gửi thành công!");
        setShowModal(true);
        setFormData({
          title: "",
          uri: "",
          academicYear: user?.academicYear || "",
          department: user?.department || "",
          name: user?.name || "",
          masv: user?.masv || "",
        });
        setSelectedFile(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else if (response.status === 401) {
        setMessage('❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setIsAuthenticated(false);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Có lỗi xảy ra: ${errorData.message || 'Vui lòng thử lại!'}`);
      }
      setShowModal(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "⚠️ Lỗi kết nối. Vui lòng kiểm tra server!"
      );
      setShowModal(true);
    } finally {
      setIsLoading(false);
      setDuplicationPercentage(null);
    }
  };

  const handleModalConfirm = () => {
    if (duplicationPercentage !== null) {
      if (duplicationPercentage <= 20) {
        // Chỉ cho phép gửi nếu dưới hoặc bằng 20%
        proceedWithUpload();
      } else {
        // Nếu vượt quá 20%, không cho gửi
        setMessage(
          `❌ Không thể gửi: Độ trùng lặp ${duplicationPercentage.toFixed(
            2
          )}% vượt quá ngưỡng cho phép (20%)`
        );
        setDuplicationPercentage(null);
        setIsLoading(false);
      }
    } else {
      setShowModal(false);
      setMessage(null);
      setIsLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setMessage(null);
    setDuplicationPercentage(null);
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage(null);
    setDuplicationPercentage(null);
    setIsLoading(false);
  };

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>📨 Gửi Yêu Cầu</h2>
        <div style={styles.authMessage}>
          <p>Vui lòng đăng nhập để sử dụng tính năng này.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📨 Gửi Yêu Cầu</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
            placeholder="Nhập tiêu đề"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Chọn file (upload lên IPFS qua Pinata)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={uploading}
          />
          {uploading && <p style={styles.statusText}>⏳ Đang upload file...</p>}
          {formData.uri && !uploading && (
            <p style={styles.successText}>
              CID:{" "}
              <a
                href={formData.uri}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {formData.uri}
              </a>
            </p>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Khoa</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: user ? "#f8f9fa" : "#ffffff",
              cursor: user ? "not-allowed" : "text"
            }}
            required
            placeholder="Nhập khoa"
            readOnly={!!user}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: user ? "#f8f9fa" : "#ffffff",
              cursor: user ? "not-allowed" : "text"
            }}
            required
            placeholder="Nhập họ tên"
            readOnly={!!user}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mã SV</label>
          <input
            type="text"
            name="masv"
            value={formData.masv}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: user ? "#f8f9fa" : "#ffffff",
              cursor: user ? "not-allowed" : "text"
            }}
            required
            placeholder="Nhập mã sinh viên"
            readOnly={!!user}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: isLoading || uploading ? "#cccccc" : "#1e90ff",
            cursor: isLoading || uploading ? "not-allowed" : "pointer",
          }}
          disabled={isLoading || uploading}
        >
          {isLoading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
        </button>
      </form>

      {showModal && message && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p
              style={{
                ...styles.message,
                color: message.includes("thành công") || message.includes("ĐỦ ĐIỀU KIỆN")
                  ? "#28a745"
                  : message.includes("lỗi") ||
                    message.includes("đã được đăng ký") ||
                    message.includes("vượt quá ngưỡng") ||
                    message.includes("KHÔNG THỂ GỬI")
                  ? "#dc3545"
                  : "#ffc107",
                whiteSpace: "pre-line"
              }}
            >
              {message}
            </p>
            <div style={styles.modalButtonGroup}>
              {duplicationPercentage !== null && duplicationPercentage <= 20 && (
                <button onClick={handleModalConfirm} style={styles.modalButton}>
                  Gửi
                </button>
              )}
              <button
                onClick={
                  duplicationPercentage !== null
                    ? handleModalCancel
                    : closeModal
                }
                style={{ ...styles.modalButton, backgroundColor: "#dc3545" }}
              >
                {duplicationPercentage !== null ? "Hủy" : "Đóng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "2rem",
    color: "#1a1a1a",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    backgroundColor: "#f8f9fa",
  },
  fileInput: {
    padding: "0.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
  },
  button: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#1e90ff",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    cursor: "pointer",
  },
  message: {
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
    wordBreak: "break-word",
  },
  statusText: {
    fontSize: "14px",
    color: "#666",
    marginTop: "0.5rem",
  },
  successText: {
    fontSize: "14px",
    color: "#28a745",
    marginTop: "0.5rem",
    wordBreak: "break-word",
  },
  link: {
    color: "#1e90ff",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
  modalButton: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#1e90ff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  modalButtonGroup: {
    display: "flex",
    gap: "1rem",
  },
  authMessage: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    border: '1px solid #f5c6cb'
  }
};

// Thêm hover effects bằng CSS thuần
const globalStyles = `
  input:focus {
    outline: none;
    border-color: #1e90ff;
    box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.2);
  }
  button:hover:not(:disabled) {
    background-color: #007bff;
    transform: translateY(-2px);
  }
  a:hover {
    color: #007bff;
    text-decoration: underline;
  }
  .modal-button:hover {
    background-color: #007bff;
  }
  @media (max-width: 600px) {
    .container {
      margin: 1rem;
      padding: 1.5rem;
    }
    .heading {
      font-size: 24px;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default SendRequest;