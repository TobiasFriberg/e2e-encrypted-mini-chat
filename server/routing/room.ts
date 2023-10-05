import { errorConstants } from '../constants';
import { writeError, writeResponse } from './utils';
import { getMyRooms, getRoomInformation, getRoomWithUsers, removeRoom, saveRoomSettings } from '../service/roomService';

export const getRoom = async (req: any, res: any) => {
  const username = req.body.user;
  const userGuid = req.token.guid || '';

  try {
    const room = await getRoomWithUsers({ username, userGuid });
    return writeResponse(res, room);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const getRooms = async (req: any, res: any) => {
  const userGuid = req.token.guid || '';

  try {
    const rooms = await getMyRooms(userGuid);
    return writeResponse(res, rooms);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const getRoomInfo = async (req: any, res: any) => {
  const userGuid = req.token.guid || '';
  const roomId = req.params.room || '';

  try {
    const room = await getRoomInformation({ roomId, userGuid });
    return writeResponse(res, room);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const saveRoom = async (req: any, res: any) => {
  const ttl = req.body.ttl;
  const userGuid = req.token.guid || '';
  const roomId = req.params.room || '';

  if (typeof ttl !== 'number' || ttl <= 0 || ttl > 168) {
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }

  try {
    const room = await saveRoomSettings({ roomId, userGuid, ttl });
    return writeResponse(res, room);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const deleteRoom = async (req: any, res: any) => {
  const userGuid = req.token.guid || '';
  const roomId = req.params.room || '';

  try {
    const room = await removeRoom({ roomId, userGuid });
    return writeResponse(res, room);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};
