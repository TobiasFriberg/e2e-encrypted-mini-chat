import fs from 'fs';
import { addHours, getUnixTime } from 'date-fns';
import UserModel from '../models/user';
import MessageModel from '../models/message';
import RoomModel from '../models/room';
require('dotenv').config();

export const createMessage = async (message: any) => {
  if (!message.room) {
    throw new Error('No message-to room id');
  }

  try {
    const user = await UserModel.findOne({ guid: message.userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    const created = getUnixTime(new Date());

    const validRoom: any = await RoomModel.findOneAndUpdate(
      {
        _id: message.room,
        users: { $in: [user._id] },
      },
      { readByUser: [user._id], lastMessage: created },
      { new: true }
    );

    if (!validRoom) {
      throw new Error('Not a valid room');
    }

    const deleteAt = getUnixTime(addHours(new Date(), validRoom.ttl || 24));

    await MessageModel.create([
      { user: user._id, room: message.room, created: created, message: message.message, deleteAt: deleteAt },
    ]);

    const toUserId = validRoom.users.find((usr: any) => usr._id.toString() !== user._id.toString());
    const toUser: any = await UserModel.findOne({ _id: toUserId }).lean().exec();

    return {
      data: {
        user: user._id,
        toUser: toUser._id,
        name: user.name,
        message: message.message,
        created: created,
        image: message.image,
      },
    };
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getMessages = async ({ room, page, userGuid }: any) => {
  try {
    const user = await UserModel.findOne({ guid: userGuid }).lean().exec();

    if (!user) {
      throw new Error('No user found');
    }

    const validRoom = await RoomModel.findOneAndUpdate(
      { _id: room, users: { $in: [user._id] } },
      { $addToSet: { readByUser: user._id } },
      { new: true }
    );

    if (!validRoom) {
      throw new Error('Not a valid room');
    }

    const pageSize: number = 15;

    const messages = await MessageModel.find({ room: room })
      .sort({ created: -1 })
      .limit(pageSize)
      .skip(pageSize * page);
    messages.reverse();
    return messages;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateImage = async ({ text, image, fileName, guid, room }: any) => {
  try {
    const user = await UserModel.findOne({ guid: guid }).orFail().exec();
    const dir = `uploads/${room}/`;

    const validRoom = await RoomModel.findOne({ _id: room, users: { $in: [user._id] } });

    if (!validRoom) {
      throw new Error('Not a valid room');
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(`${dir}${fileName}`, image.split(';base64,').pop(), { encoding: 'base64' }, (err: any) => {
      if (err) {
        throw new Error(err);
      }
    });

    const created = getUnixTime(new Date());
    const deleteAt = getUnixTime(addHours(new Date(), validRoom.ttl || 24 * 7));

    const message = await MessageModel.create({
      user: user._id,
      room: room,
      created: created,
      message: text,
      image: fileName,
      deleteAt: deleteAt,
    });

    return {
      user: { _id: user._id, name: user.name },
      message: message.message,
      created: created,
      image: message.image,
    };
  } catch (e: any) {
    throw new Error(e);
  }
};

export const purgeMessages = async () => {
  try {
    const time = getUnixTime(new Date());
    const imagesToDelete = await MessageModel.find({ deleteAt: { $lt: time }, image: { $exists: true, $ne: '' } });

    imagesToDelete.forEach((msg) => {
      const dir = `uploads/${msg.room}/${msg.image}`;
      fs.unlinkSync(dir);
    });

    await MessageModel.deleteMany({ deleteAt: { $lt: time } }).exec();
  } catch (e: any) {
    throw new Error(e);
  }
};
