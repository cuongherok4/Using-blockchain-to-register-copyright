import { NextResponse } from "next/server";
import db from "../../../../db";

export async function GET() {
  try {
    const query = "SELECT * FROM blockchain";
    const [rows] = await db.promise().query(query);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu:", error.message);
    return NextResponse.json(
      { error: "Lỗi khi lấy dữ liệu từ cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}