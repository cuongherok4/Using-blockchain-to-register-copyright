import type { Config } from "tailwindcss"; 
// Import kiểu dữ liệu `Config` từ thư viện Tailwind CSS để định nghĩa kiểu cho biến `config`

const config: Config = {                      // Khai báo biến `config` với kiểu là `Config` của Tailwind
  content: [                                  // Chỉ định các file mà Tailwind sẽ quét để tạo CSS
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",   // Quét tất cả file ở thư mục pages có các phần mở rộng này
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Quét thư mục components để tìm class Tailwind
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",     // Quét thư mục app (Next.js 13+ sử dụng app router)
  ],
  theme: {
    extend: {                                 // Mở rộng các thuộc tính mặc định của Tailwind
      colors: {                               // Tùy chỉnh bảng màu
        background: "var(--background)",      // Thêm màu `background` lấy từ biến CSS toàn cục
        foreground: "var(--foreground)",      // Thêm màu `foreground` cũng từ biến CSS
      },
    },
  },
  plugins: [],                                // Không sử dụng plugin nào thêm trong Tailwind (có thể thêm sau)
};

export default config;                        // Xuất mặc định cấu hình để Tailwind sử dụng
