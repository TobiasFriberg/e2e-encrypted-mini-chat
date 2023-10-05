import { createMessage, getMessages, updateImage } from '../service/messageService';
import { errorConstants } from '../constants';
import { writeError, writeResponse } from './utils';
import { getSocketId } from '../socket';

export const sendMessage = async (req: any, res: any) => {
  const room = req.body.room;
  const message = req.body.message.trim().substring(0, 300);
  const userGuid = req.token.guid || '';

  try {
    const match = await createMessage({ room, message, userGuid });

    const socketId = getSocketId(match.data.toUser.toString());
    req.app.locals.io.to(socketId).emit('newMessage', { room: room, name: match.data.name });
    req.app.locals.io.to(room).emit('newChatMessage', match.data);
    return writeResponse(res, match.data);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const getAllMessages = async (req: any, res: any) => {
  const userGuid = req.token.guid || '';
  const room = req.params.room || '';
  const page = req.params.page || 0;

  try {
    const match = await getMessages({ room, page, userGuid });
    return writeResponse(res, match);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const saveImage = async (req: any, res: any) => {
  const image = req.body.image;
  const fileName = req.body.fileName;
  const text = req.body.message.trim().substring(0, 1000) || '';
  const room = req.body.room;
  const guid = req.token.guid || '';

  try {
    const imageToReturn = await updateImage({
      text,
      image,
      fileName,
      guid,
      room,
    });
    return writeResponse(res, imageToReturn);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};
