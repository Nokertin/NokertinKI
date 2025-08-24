import formidable from "formidable";
import fs from "fs";
import path from "path";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload error" });

      const message = fields.message;
      let imageData = null;

      if (files.image) {
        const filePath = files.image.filepath;
        imageData = fs.readFileSync(filePath, { encoding: "base64" });
      }

      try {
        const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=" + process.env.GEMINI_API_KEY, {
          contents: [{
            parts: [
              { text: message },
              ...(imageData ? [{ inline_data: { mime_type: "image/png", data: imageData } }] : [])
            ]
          }]
        });

        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ role: "assistant", content: text });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}