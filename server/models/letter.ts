import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LetterSchema = new Schema({
  value: String,
  created: String,
});

const Letter = mongoose.model('Letter', LetterSchema);

export default Letter;
