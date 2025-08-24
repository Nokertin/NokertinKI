import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post("/api/chat", { message: userMsg.content });
      const aiMsg = { role: "assistant", content: res.data.content };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка при получении ответа 😢" },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-xl shadow-md ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-gray-800 text-gray-100"
            }`}
          >
            {m.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="border-t border-gray-700 p-3 flex gap-2">
        <input
          className="flex-1 bg-gray-800 text-white rounded px-3 py-2 outline-none"
          placeholder="Напишите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
