import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String, required: true },
  text: { type: String, required: true },
  reactions: {
    type: Map,
    of: [String], // Array of userIds who reacted
    default: {
      like: [],
      love: [],
      laugh: [],
    },
  },
  date: { type: Date, default: Date.now },
});

const Comment =
  mongoose.models.comment || mongoose.model('comment', commentSchema);

export default Comment;
