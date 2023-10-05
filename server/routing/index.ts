import { errorConstants } from '../constants';
import { getAllMessages, saveImage, sendMessage } from './message';
import { deleteRoom, getRoom, getRoomInfo, getRooms, saveRoom } from './room';
import { login, registerUser, deleteAccount, getUserByToken, updateUser } from './user';
import { letterDecrypt, verifyUser, writeError } from './utils';

require('dotenv').config();

const authenticatedByJwt = (req: any, res: any, next: any) => {
  const token = req.headers['x-csrf'] || '';

  try {
    const decodedToken = verifyUser(token);
    req.token = decodedToken;
    next();
  } catch (e) {
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export default (app: any) => {
  // User
  app.post('/api/user', (req: any, res: any) => login(req, res));
  app.post('/api/user/create', (req: any, res: any) => registerUser(req, res));
  app.post('/api/user/profile', authenticatedByJwt, (req: any, res: any) => getUserByToken(req, res));
  app.post('/api/user/save', authenticatedByJwt, (req: any, res: any) => updateUser(req, res));
  app.delete('/api/user', authenticatedByJwt, (req: any, res: any) => deleteAccount(req, res));

  app.post('/api/message', authenticatedByJwt, (req: any, res: any) => sendMessage(req, res));
  app.post('/api/letterdecrypt', (req: any, res: any) => letterDecrypt(req, res));
  app.post('/api/message/img', authenticatedByJwt, (req: any, res: any) => saveImage(req, res));
  app.get('/api/messages/:room/:page', authenticatedByJwt, (req: any, res: any) => getAllMessages(req, res));

  app.post('/api/room', authenticatedByJwt, (req: any, res: any) => getRoom(req, res));
  app.post('/api/room/:room', authenticatedByJwt, (req: any, res: any) => saveRoom(req, res));
  app.delete('/api/room/:room', authenticatedByJwt, (req: any, res: any) => deleteRoom(req, res));
  app.get('/api/room/:room', authenticatedByJwt, (req: any, res: any) => getRoomInfo(req, res));
  app.get('/api/rooms', authenticatedByJwt, (req: any, res: any) => getRooms(req, res));
};
