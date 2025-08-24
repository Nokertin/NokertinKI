import { NextResponse } from 'next/server';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { login, pass } = req.body;

    if (login === 'admin' && pass === 'admin') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('auth', '1', { path: '/' });
      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Неверный логин или пароль' }, { status: 401 });
    }
  } else {
    return NextResponse.json({ message: 'Метод не разрешен' }, { status: 405 });
  }
}