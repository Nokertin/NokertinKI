# AI Chat Full (minimal)

Features:
- Login admin/admin (cookie-based)
- Chat UI with sidebar
- Upload images (saved to /public/uploads)
- Messages and chats saved in MongoDB (MONGODB_URI)
- Calls Gemini (Generative Language) API using GEMINI_API_KEY

Run locally:
1. copy .env.example to .env.local and set MONGODB_URI and GEMINI_API_KEY
2. npm install
3. npm run dev
4. open http://localhost:3000, login admin/admin

Notes:
- Uploaded images are saved to the local filesystem (public/uploads). On Render this is ephemeral — for production use S3 or GridFS.
- Gemini image processing is approximated by sending image URLs in the prompt.
