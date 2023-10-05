import { getUnixTime } from 'date-fns';
import UserModel from '../models/user';
import RoomModel from '../models/room';
require('dotenv').config();

export const getRoomWithUsers = async ({ username, userGuid }: any) => {
  if (!username || !userGuid) {
    throw new Error('Missing room props');
  }

  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();
    const toUser = await UserModel.findOne({ name: new RegExp(`^${username}$`, 'i') })
      .lean()
      .exec();

    if (!toUser || !user) {
      throw new Error('No user found');
    }

    if (!user || !toUser || user?._id.toString() === toUser._id.toString()) {
      throw new Error('No user found');
    }

    let room: any = await RoomModel.findOne({
      users: { $all: [user._id, toUser._id] },
    });

    if (!room) {
      const created = getUnixTime(new Date());
      room = await RoomModel.create({ users: [user._id, toUser._id], created: created });
    }

    return room;
  } catch (e: any) {
    throw new Error('Could not fetch rooms');
  }
};

export const getMyRooms = async (userGuid: string) => {
  if (!userGuid) {
    throw new Error('Missing room props');
  }

  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    return await RoomModel.find({
      users: { $in: [user._id] },
    })
      .sort({ lastMessage: -1 })
      .populate('users', 'name');
  } catch (e: any) {
    console.log(e);
    throw new Error('Could not fetch rooms');
  }
};

export const getRoomInformation = async ({ roomId, userGuid }: any) => {
  if (!userGuid || !roomId) {
    throw new Error('Missing room props');
  }

  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    const room = await RoomModel.findOne({ _id: roomId, users: { $in: [user._id] } });

    if (!room) {
      throw new Error('Room not found / no access to room');
    }

    return room;
  } catch (e: any) {
    throw new Error('Could not fetch room information');
  }
};

export const saveRoomSettings = async ({ roomId, userGuid, ttl }: any) => {
  if (!userGuid) {
    throw new Error('Missing room props');
  }

  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    const inRoom = await RoomModel.findOne({ _id: roomId, users: { $in: [user._id] } });

    if (!inRoom) {
      throw new Error('Room not found / no access to room');
    }

    await RoomModel.findOneAndUpdate({ _id: roomId }, { ttl: ttl });

    return true;
  } catch (e: any) {
    throw new Error('Could not save room');
  }
};

export const removeRoom = async ({ roomId, userGuid, ttl }: any) => {
  if (!userGuid) {
    throw new Error('Missing room props');
  }

  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    return await RoomModel.deleteOne({ _id: roomId, users: { $in: [user._id] } });
  } catch (e: any) {
    throw new Error('Could not remove room');
  }
};
