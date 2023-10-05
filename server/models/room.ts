import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  users: [{ type: Types.ObjectId, ref: 'Users' }],
  created: Number,
  lastMessage: Number,
  readByUser: [{ type: Types.ObjectId, ref: 'Users' }],
  ttl: { type: Number, default: 168 },
});

const Room = mongoose.model('Rooms', RoomSchema);

export default Room;
