import { NextResponse } from 'next/server';

export default function middleware(request) {
  // Получаем куки из запроса
  const cookie = request.cookies.get('auth');

  // Если куки 'auth' нет
  if (!cookie || cookie.value !== '1') {
    // Если пользователь пытается зайти не на страницу входа
    if (request.nextUrl.pathname !== '/login') {
      // Перенаправляем его на страницу входа
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Если куки 'auth' есть и пользователь пытается зайти на страницу входа
  if (cookie && cookie.value === '1' && request.nextUrl.pathname === '/login') {
    // Перенаправляем его на главную страницу
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Если все в порядке, продолжаем
  return NextResponse.next();
}