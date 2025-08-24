import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  const sendMessage = async () => {
    const formData = new FormData();
    formData.append("message", input);
    if (image) formData.append("image", image);
    const res = await axios.post("/api/chat", formData);
    setMessages([...messages, { role: "user", content: input }, res.data]);
    setInput("");
    setImage(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">AI Chat</h1>
      <div className="my-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
      <textarea
        className="border w-full p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}