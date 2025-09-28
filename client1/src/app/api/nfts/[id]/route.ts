import { NextResponse } from "next/server";
import db from "../../../../../db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const query = "DELETE FROM blockchainmodel WHERE id = ?";
    const [result] = await db.promise().query(query, [params.id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Không tìm thấy đề tài" }, { status: 404 });
    }
    return NextResponse.json({ message: "Xóa đề tài thành công" }, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi khi xóa đề tài:", error.message);
    return NextResponse.json({ error: "Lỗi khi xóa đề tài" }, { status: 500 });
  }
}