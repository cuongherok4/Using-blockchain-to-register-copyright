import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const btnBaseStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "10px",
  fontSize: "0.875rem",
  fontWeight: 600,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  border: "none",
  cursor: "pointer",
  color: "white",
  userSelect: "none",
  marginRight: 8,
  transition: "all 0.3s ease",
};

const NFTList: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState({ title: "", name: "", msv: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:8000/blockchain/all_nft", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi fetch dữ liệu");
        return res.json();
      })
      .then((data) => setTopics(data.data.nfts))
      .catch((err) => console.error(err));
  }, []);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      topic.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (topic.msv?.toLowerCase().includes(filters.msv.toLowerCase()) ?? true)
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Chuyển sang trang TopicDetail
  const handleViewDetail = (topicId: string) => {
    navigate(`/topic-detail/${topicId}`);
  };

  // Xử lý duyệt đề tài
  const handleApprove = async (item: Topic) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/blockchain/approve/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(`Đã duyệt đề tài: ${item.title}`);
        // Cập nhật trạng thái trong danh sách
        setTopics(prevTopics => 
          prevTopics.map(topic => 
            topic.id === item.id ? { ...topic, status: "đã duyệt" } : topic
          )
        );
      } else {
        alert("Có lỗi khi duyệt đề tài");
      }
    } catch (error) {
      console.error("Error approving topic:", error);
      alert("Có lỗi khi duyệt đề tài");
    }
  };

  // Xử lý xóa đề tài
  const handleDelete = async (item: Topic) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề tài "${item.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8000/blockchain/delete/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Đã xóa đề tài thành công");
          // Cập nhật danh sách
          setTopics(prevTopics => prevTopics.filter(topic => topic.id !== item.id));
        } else {
          alert("Có lỗi khi xóa đề tài");
        }
      } catch (error) {
        console.error("Error deleting topic:", error);
        alert("Có lỗi khi xóa đề tài");
      }
    }
  };

  // Xử lý tải tài liệu
  const handleDownload = (item: Topic) => {
    if (item.uri) {
      window.open(item.uri, "_blank");
    } else {
      alert("Không có tài liệu để tải");
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "3rem 1rem",
        background:
          "linear-gradient(to bottom right, #ebf8ff, #ffffff, #ebf8ff)",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#1e40af",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "3rem",
          textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        Danh Sách Đề Tài
      </h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: "2.5rem",
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
          flexWrap: "wrap",
        }}
      >
        {["title", "name", "msv"].map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={(filters as any)[key]}
            onChange={handleFilterChange}
            placeholder={`Lọc theo ${
              key === "msv"
                ? "mã sinh viên"
                : key === "title"
                ? "tên đề tài"
                : "tên sinh viên"
            }...`}
            style={{
              flex: 1,
              padding: "12px 20px",
              fontSize: 16,
              border: "2px solid #93c5fd",
              borderRadius: 12,
              outline: "none",
              color: "#374151",
            }}
          />
        ))}
      </div>

      <div
        style={{
          overflowX: "auto",
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
          backgroundColor: "white",
          border: "1px solid #bfdbfe",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#1e293b",
          }}
        >
          <thead
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              textTransform: "uppercase",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            <tr>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left" }}>
                Tên Đề Tài
              </th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left" }}>
                Tên Sinh Viên
              </th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left" }}>
                Mã Sinh Viên
              </th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left" }}>
                Trạng Thái
              </th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTopics.length > 0 ? (
              filteredTopics.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #dbeafe",
                    backgroundColor:
                      filteredTopics.indexOf(item) % 2 === 1
                        ? "#eff6ff"
                        : "white",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bfdbfe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      filteredTopics.indexOf(item) % 2 === 1
                        ? "#eff6ff"
                        : "white")
                  }
                >
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>
                    {item.title}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>{item.name}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {item.msv || "Chưa có mã SV"}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        backgroundColor: item.status === "chờ duyệt" ? "#fef3c7" : "#d1fae5",
                        color: item.status === "chờ duyệt" ? "#92400e" : "#166534",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {item.status === "chờ duyệt" ? (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <button
                          style={{
                            ...btnBaseStyle,
                            backgroundColor: "#16a34a",
                            marginRight: 4,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#15803d")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#16a34a")
                          }
                          onClick={() => handleApprove(item)}
                        >
                          Duyệt
                        </button>
                        <button
                          style={{
                            ...btnBaseStyle,
                            backgroundColor: "#2563eb",
                            marginRight: 4,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1e40af")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2563eb")
                          }
                          onClick={() => handleViewDetail(item.id)}
                        >
                          Xem Chi Tiết
                        </button>
                        <button
                          style={{
                            ...btnBaseStyle,
                            backgroundColor: "#dc2626",
                            marginRight: 0,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#b91c1c")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onClick={() => handleDelete(item)}
                        >
                          Xóa
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <button
                          style={{
                            ...btnBaseStyle,
                            backgroundColor: "#7c3aed",
                            marginRight: 4,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#6d28d9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7c3aed")
                          }
                          onClick={() => handleDownload(item)}
                        >
                          Tải
                        </button>
                        <button
                          style={{
                            ...btnBaseStyle,
                            backgroundColor: "#2563eb",
                            marginRight: 0,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1e40af")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2563eb")
                          }
                          onClick={() => handleViewDetail(item.id)}
                        >
                          Xem Chi Tiết
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#6b7280",
                    fontStyle: "italic",
                    userSelect: "none",
                  }}
                >
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NFTList;