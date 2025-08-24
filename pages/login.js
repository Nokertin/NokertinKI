import { useState } from "react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (login === "admin" && password === "admin") {
      document.cookie = "auth=1; path=/"; // ставим куку
      window.location.href = "/";
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-white text-center">Вход</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
