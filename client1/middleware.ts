import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Các route cần đăng nhập mới truy cập được
  const protectedPaths = ['/list', '/create', '/list_blockchain'];

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
// Chỉ áp dụng middleware cho các route bắt đầu bằng /list, /create, /list_blockchain