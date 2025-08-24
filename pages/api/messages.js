import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../lib/db';
import Message from '../../models/Message';
import Chat from '../../models/Chat';
import axios from 'axios';

export const config = {
  api: { bodyParser: false }
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export default async function handler(req, res){
  await dbConnect();
  if(req.method !== 'POST') return res.status(405).end();

  const form = formidable({ multiples: true, uploadDir: UPLOAD_DIR, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if(err) { console.error(err); return res.status(500).json({ error: 'parse error' }); }

    const chatId = fields.chatId;
    const text = fields.text || '';

    const images = [];
    if(files.files){
      const arr = Array.isArray(files.files) ? files.files : [files.files];
      for(const f of arr){
        const filename = path.basename(f.filepath);
        images.push('/uploads/' + filename);
      }
    }

    // save user message
    await Message.create({ chatId, role: 'user', text, images });

    // build prompt for Gemini: include text and image urls as text hints
    let prompt = text || '';
    if(images.length) {
      prompt += '\n\nImages:\n' + images.join('\n');
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const body = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      };

      const response = await axios.post(url, body);
      const textResp = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';

      // save assistant message
      const assist = await Message.create({ chatId, role: 'assistant', text: textResp });

      // update chat timestamp
      await Chat.findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } });

      res.json({ ok: true, assistant: assist });
    } catch (e) {
      console.error('AI error:', e.response?.data || e.message);
      res.status(500).json({ error: 'AI request failed' });
    }
  });
}
