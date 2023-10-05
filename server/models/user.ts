import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  password: String,
  name: String,
  created: Number,
  guid: String,
  token: String,
  lastLogin: Number,
});

const User = mongoose.model('Users', UserSchema);

export default User;
