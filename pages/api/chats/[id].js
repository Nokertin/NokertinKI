import dbConnect from '../../../lib/db';
import Chat from '../../../models/Chat';
import Message from '../../../models/Message';
import mongoose from 'mongoose';

export default async function handler(req, res){
  await dbConnect();
  const { id } = req.query;
  if(req.method === 'GET'){
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({error:'invalid id'});
    const chat = await Chat.findById(id).lean();
    if(!chat) return res.status(404).json({error:'not found'});
    const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).lean();
    res.json({ ...chat, messages });
    return;
  }
  res.status(405).end();
}
