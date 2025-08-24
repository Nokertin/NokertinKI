import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  title: String,
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
