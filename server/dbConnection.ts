import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const dbConn = () => {
  const mongoDB =
    'mongodb://' +
    process.env.MONGO_USER +
    ':' +
    process.env.MONGO_PW +
    '@' +
    process.env.MONGO_DB +
    '?retryWrites=true&w=majority';
  mongoose.connect(mongoDB);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.on('open', console.log.bind(console, 'Successfully connected database'));
};

export default dbConn;
