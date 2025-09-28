const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "123456",
  database: "NCKH_k13",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Kết nối thất bại:", err.message);
    return;
  }
  console.log("✅ Kết nối MySQL thành công!");

  // Tạo bảng blocchainmodel nếu chưa tồn tại
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS blocchainmodel (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      uri VARCHAR(255) NOT NULL,
      academic_year VARCHAR(50) NOT NULL,
      department VARCHAR(100) NOT NULL,
      name VARCHAR(255),
      masv VARCHAR(50)
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi tạo bảng blocchainmodel:", err.message);
      return;
    }
    console.log("✅ Bảng blocchainmodel đã được tạo hoặc đã tồn tại!");

    // Xóa dữ liệu cũ và chèn dữ liệu mới
    const truncateTableQuery = "TRUNCATE TABLE blocchainmodel";
    db.query(truncateTableQuery, (err) => {
      if (err) {
        console.error("❌ Lỗi khi xóa dữ liệu cũ:", err.message);
        return;
      }
      console.log("✅ Đã xóa dữ liệu cũ trong bảng blocchainmodel!");

      // Chèn dữ liệu mẫu mới
      const insertDataQuery = `
        INSERT INTO blocchainmodel (title, uri, academic_year, department, name, masv) VALUES
        ('Nghiên cứu AI trong giáo dục', 'https://gateway.pinata.cloud/ipfs/QmX123...', '2023-2024', 'Công nghệ Thông tin', 'Nguyễn Văn A', 'SV001'),
        ('Phân tích dữ liệu lớn', 'https://gateway.pinata.cloud/ipfs/QmY456...', '2023-2024', 'Khoa học Dữ liệu', 'Trần Thị B', 'SV002'),
        ('Ứng dụng Blockchain', 'https://gateway.pinata.cloud/ipfs/QmZ789...', '2023-2024', 'Công nghệ Thông tin', 'Lê Văn C', 'SV003'),
        ('Phát triển ứng dụng web', 'https://gateway.pinata.cloud/ipfs/QmA101...', '2023-2024', 'Kỹ thuật Phần mềm', 'Phạm Thị D', 'SV004'),
        ('IoT trong nông nghiệp', 'https://gateway.pinata.cloud/ipfs/QmB202...', '2023-2024', 'Điện tử', 'Hoàng Văn E', 'SV005')
      `;

      db.query(insertDataQuery, (err, result) => {
        if (err) {
          console.error("❌ Lỗi khi chèn dữ liệu mẫu:", err.message);
          return;
        }
        console.log("✅ Đã chèn dữ liệu mẫu mới vào bảng blocchainmodel!");
      });
    });
  });
});

module.exports = db;