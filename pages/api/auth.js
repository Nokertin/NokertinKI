export default function handler(req, res) {
  if (req.method === 'POST') {
    const { login, pass } = req.body;

    if (login === 'admin' && pass === 'admin') {
      // Это правильный способ установки куки для твоего проекта
      res.setHeader('Set-Cookie', 'auth=1; Path=/');
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}