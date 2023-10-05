import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'Users' },
  room: { type: Types.ObjectId, ref: 'Rooms' },
  created: Number,
  deleteAt: Number,
  message: String,
  image: String,
});

const Message = mongoose.model('Messages', MessageSchema);

export default Message;
