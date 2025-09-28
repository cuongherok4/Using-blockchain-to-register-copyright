import { NextResponse } from "next/server";
import db from "../../../../db"; // Điều chỉnh đường dẫn đến file db.js

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tendetai, tensinhvien, masinhvien, khoahoc, cid } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!tendetai || !tensinhvien || !masinhvien || !khoahoc || !cid) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc!" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO KHODL (tendetai, tensinhvien, masinhvien, khoahoc, cid)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [tendetai, tensinhvien, masinhvien, khoahoc, cid];

    await db.promise().query(query, values);

    return NextResponse.json(
      { message: "Đề tài đã được lưu thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Lỗi khi lưu dữ liệu:", error.message);
    return NextResponse.json(
      { error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}