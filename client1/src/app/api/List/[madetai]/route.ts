import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2"; // Thêm import này
import db from "../../../../../db";

export async function DELETE(request: Request, { params }: { params: { madetai: string } }) {
  const { madetai } = params;

  try {
    // Kiểm tra xem đề tài có tồn tại không
    const checkQuery = "SELECT * FROM KHODL WHERE madetai = ?";
    const [rows] = await db.promise().query(checkQuery, [madetai]) as unknown as [RowDataPacket[]];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy đề tài để xóa" }, { status: 404 });
    }

    // Xóa đề tài từ database
    const deleteQuery = "DELETE FROM KHODL WHERE madetai = ?";
    await db.promise().query(deleteQuery, [madetai]);

    return NextResponse.json({ message: "Xóa đề tài thành công" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa đề tài:", error.message);
    return NextResponse.json(
      { error: "Lỗi khi xóa đề tài từ cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}