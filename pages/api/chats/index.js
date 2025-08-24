import dbConnect from '../../../lib/db';
import Chat from '../../../models/Chat';

export default async function handler(req, res){
  await dbConnect();
  if(req.method === 'GET'){
    const chats = await Chat.find({}).sort({ updatedAt: -1 }).lean();
    res.json(chats);
    return;
  }
  if(req.method === 'POST'){
    const doc = await Chat.create({ title: req.body.title || 'Новый чат' });
    res.json(doc);
    return;
  }
  res.status(405).end();
}
