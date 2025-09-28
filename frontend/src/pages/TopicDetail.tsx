// src/pages/TopicDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/blockchain/all_nft", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải chi tiết đề tài");
        }

        const data = await response.json();
        const allTopics: Topic[] = data.data.nfts || [];
        
        const foundTopic = allTopics.find((topic: Topic) => topic.id === id);
        
        if (!foundTopic) {
          throw new Error("Không tìm thấy đề tài với ID này");
        }
        
        setTopic(foundTopic);
        setRelatedTopics(
          allTopics
            .filter((t: Topic) => t.id !== foundTopic.id && t.department === foundTopic.department)
            .slice(0, 5)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTopicDetail();
    }
  }, [id, navigate]);

  const handleApprove = async () => {
    if (!topic) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/blockchain/approve/${topic.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(`Đã duyệt đề tài: ${topic.title}`);
        setTopic({ ...topic, status: "đã duyệt" });
      } else {
        alert("Có lỗi khi duyệt đề tài");
      }
    } catch (error) {
      alert("Có lỗi khi duyệt đề tài");
    }
  };

  const handleDelete = async () => {
    if (!topic) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề tài "${topic.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8000/blockchain/delete/${topic.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Đã xóa đề tài thành công");
          navigate("/");
        } else {
          alert("Có lỗi khi xóa đề tài");
        }
      } catch (error) {
        alert("Có lỗi khi xóa đề tài");
      }
    }
  };

  const handleDownload = () => {
    if (topic?.uri) {
      window.open(topic.uri, "_blank");
    } else {
      alert("Không có tài liệu để tải");
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #ebf8ff, #ffffff, #ebf8ff)",
        fontSize: "1.2rem",
        color: "#1e40af"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #93c5fd",
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p>Đang tải thông tin đề tài...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #ebf8ff, #ffffff, #ebf8ff)",
        color: "#1e40af",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid #bfdbfe"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#dc2626" }}>
            {error || "Không tìm thấy đề tài"}
          </h2>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1e40af";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #ebf8ff, #ffffff, #ebf8ff)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #bfdbfe",
        padding: "20px 0",
        marginBottom: "3rem"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1e40af";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            ← Quay lại
          </button>
          <h1 style={{
            color: "#1e40af",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: 0,
            textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}>
            Chi Tiết Đề Tài
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: "30px"
      }}>
        {/* Left Panel - Thông tin đề tài */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Thông tin chính */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "30px",
            border: "1px solid #bfdbfe",
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <h2 style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#1e40af",
                margin: "0 0 15px 0",
                lineHeight: 1.3
              }}>
                {topic.title}
              </h2>
              <span style={{
                padding: "4px 12px",
                backgroundColor: topic.status === "chờ duyệt" ? "#fef3c7" : "#d1fae5",
                color: topic.status === "chờ duyệt" ? "#92400e" : "#166534",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase"
              }}>
                {topic.status}
              </span>
            </div>

            {/* Thông tin đề tài gộp */}
            <div style={{
              backgroundColor: "#eff6ff",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #93c5fd",
              marginBottom: "25px"
            }}>
              <h3 style={{
                color: "#2563eb",
                fontSize: "1.2rem",
                fontWeight: "600",
                marginBottom: "20px",
                borderBottom: "2px solid #2563eb",
                paddingBottom: "10px",
                textAlign: "center"
              }}>
                Thông tin đề tài
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                color: "#1e293b"
              }}>
                <div>
                  <p style={{ marginBottom: "8px" }}><strong>Tên sinh viên:</strong> {topic.name}</p>
                  <p style={{ marginBottom: "8px" }}><strong>Mã sinh viên:</strong> {topic.msv || "Chưa có"}</p>
                  <p style={{ marginBottom: "8px" }}><strong>ID NFT:</strong> {topic.id}</p>
                </div>
                <div>
                  <p style={{ marginBottom: "8px" }}><strong>Khoa:</strong> {topic.department}</p>
                  <p style={{ marginBottom: "8px" }}><strong>Niên khóa:</strong> {topic.academicYear}</p>
                </div>
              </div>
            </div>

            {/* Nút tải */}
            {topic.uri && (
              <div style={{
                textAlign: "center",
                marginBottom: "25px"
              }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "15px 40px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 12px rgba(37, 99, 235, 0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(37, 99, 235, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(37, 99, 235, 0.3)";
                  }}
                >
                  Tải tài liệu
                </button>
              </div>
            )}

            {/* Action buttons */}
            {topic.status === "chờ duyệt" && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "25px" }}>
                <button
                  onClick={handleApprove}
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    padding: "12px 20px",
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15803d"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                >
                  Duyệt
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    padding: "12px 20px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Bài liên quan */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "25px",
            border: "1px solid #bfdbfe",
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{
              color: "#1e40af",
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "20px",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Bài liên quan
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {relatedTopics.length > 0 ? (
                  relatedTopics.map((relTopic) => (
                    <div
                      key={relTopic.id}
                      style={{
                        padding: "15px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onClick={() => navigate(`/topic-detail/${relTopic.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                        e.currentTarget.style.borderColor = "#93c5fd";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      <h4 style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#1e40af",
                        marginBottom: "5px",
                        lineHeight: 1.4
                      }}>
                        {relTopic.title}
                      </h4>
                      <p style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: 1.3
                      }}>
                        {relTopic.name} • {relTopic.department} • {relTopic.academicYear}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    textAlign: "center"
                  }}>
                    Không có đề tài liên quan.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Document Viewer */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "25px",
          border: "1px solid #bfdbfe",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{
            color: "#1e40af",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "20px",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Nội dung tài liệu
          </h2>
          
          <div style={{
            flex: 1,
            minHeight: "700px",
            border: "2px solid #93c5fd",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#f8fafc"
          }}>
            {topic.uri ? (
              <iframe
                src={topic.uri}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  minHeight: "700px"
                }}
                title="Document Viewer"
              />
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "#6b7280",
                textAlign: "center"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#93c5fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  fontSize: "2rem",
                  color: "white"
                }}>
                  📄
                </div>
                <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#1e40af" }}>
                  Không có tài liệu để hiển thị
                </p>
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Tài liệu chưa được tải lên hoặc không khả dụng
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1200px) {
          div[style*="gridTemplateColumns: 1fr 1.2fr"] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TopicDetail;