import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Разрешаем доступ к страницам логина и статике
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Проверяем куку auth
  const auth = req.cookies.get("auth");
  if (auth?.value === "1") {
    return NextResponse.next();
  }

  // Если не авторизован — редиректим на /login
  return NextResponse.redirect(new URL("/login", req.url));
}
