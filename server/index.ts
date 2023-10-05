import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import router from './routing';
import db from './dbConnection';
import { socketServer } from './socket';
import cron from './cron';
require('dotenv').config();

const PORT = process.env.PORT || 4004;

const app = express();
db();
const server = http.createServer(app);
const io = socketServer(server);

app.locals.io = io;

const options = {
  limit: '3mb',
};

app.use(cors());
app.use(express.json(options));

app.use('/static', express.static('uploads'));
cron();
router(app);

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
