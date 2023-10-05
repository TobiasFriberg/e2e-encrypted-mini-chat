import fs from 'fs';
import bcrypt from 'bcrypt';
import { getUnixTime, subMonths } from 'date-fns';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { utils } from './utils';
import UserModel from '../models/user';
import MessageModel from '../models/message';
import RoomModel from '../models/room';
require('dotenv').config();

const saltRounds = 10;

const updateToken = async (user: any) => {
  const newGuid = uuidv4();
  await UserModel.findOneAndUpdate({ name: new RegExp(`^${user.name}$`, 'i') }, { guid: newGuid }).exec();
  const token = jwt.sign({ guid: newGuid }, process.env.JWT_SECRET || '', {
    expiresIn: '60d',
  });

  return token;
};

const userPropsToReturn = (user: any) => {
  return {
    _id: user._id,
    name: user.name,
    guid: user.guid,
    created: user.created,
  };
};

const checkUserForErrors = async (user: any, oldUser: any = {}) => {
  const isNew = !oldUser._id;

  if (!user.name || user.name.trim().length >= 100) {
    throw new Error('Invalid name');
  }

  if (isNew || (!isNew && user.password && user.password.trim() !== '')) {
    if (!user.password || !user.password.match(utils.passwordRegex)) {
      throw new Error('Password is too weak');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
  }

  if (isNew) {
    const checkExistingUser = await UserModel.findOne({ name: new RegExp(`^${user.name}$`, 'i') }).exec();

    if (checkExistingUser) {
      throw new Error('user already exists');
    }
  }

  return { ...oldUser, ...user };
};

export const createUser = async (user: any) => {
  let washedUser = user;

  try {
    washedUser = await checkUserForErrors(user);
  } catch (e: any) {
    throw new Error(e);
  }

  const newUser = { ...washedUser, guid: uuidv4(), created: getUnixTime(new Date()) };

  return await UserModel.create([newUser]);
};

export const loginUser = async (name: string, password: string) => {
  if (!name || !password) {
    throw new Error(`Missing email or password credentials.`);
  }

  try {
    const foundUser = await UserModel.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
    const match = await bcrypt.compare(password, foundUser?.password || '');

    if (!match) {
      throw new Error('invalid password');
    }

    const userToReturn = userPropsToReturn(foundUser);
    const token = await updateToken(userToReturn);

    return { token: token };
  } catch (e) {
    throw new Error('User not found');
  }
};

export const saveUser = async (password: string, oldPassword: string, guid: string) => {
  console.log(password, oldPassword);
  if (!password) {
    throw new Error(`Missing email or password credentials.`);
  }

  let newPassword = '';

  if (password && password.trim() !== '') {
    if (!password.match(utils.passwordRegex)) {
      throw new Error('Password is too weak');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    newPassword = hashedPassword;
  }

  try {
    const foundUser = await UserModel.findOne({ guid: guid }).exec();
    const match = await bcrypt.compare(oldPassword, foundUser?.password || '');

    if (!match) {
      throw new Error('invalid password');
    }

    await UserModel.findOneAndUpdate({ guid: guid }, { password: newPassword });

    return true;
  } catch (e) {
    console.log(e);
    throw new Error('User not found');
  }
};

export const getUserProfile = async (guid: string) => {
  try {
    const time = getUnixTime(new Date());
    const foundUser = await UserModel.findOneAndUpdate({ guid: guid }, { lastLogin: time }, { new: true })
      .orFail()
      .exec();
    const userToReturn = userPropsToReturn(foundUser);
    return userToReturn;
  } catch (e) {
    throw new Error(`Could not find user profile`);
  }
};

export const getUserProfileById = async (guid: string, id: string) => {
  try {
    const user = await UserModel.findOne({ guid: guid }).lean().exec();

    if (!user) {
      throw new Error(`Could not find user profile`);
    }

    const userProfile = await UserModel.findOne({ _id: id }).orFail().exec();

    return userProfile;
  } catch (e) {
    throw new Error(`Could not find user profile`);
  }
};

export const removeUser = async (guid: string, password: string) => {
  try {
    const foundUser = await UserModel.findOne({ guid: guid }).exec();
    const match = await bcrypt.compare(password, foundUser?.password || '');

    if (!match || !foundUser) {
      throw new Error('invalid password');
    }

    const rooms = await RoomModel.find({ users: { $in: [foundUser._id] } });

    rooms.forEach((room) => {
      const dir = `uploads/${room._id}`;
      fs.rmSync(dir, { recursive: true, force: true });
    });

    await MessageModel.deleteMany({ users: { $in: [foundUser._id] } });
    await RoomModel.deleteMany({ users: { $in: [foundUser._id] } });
    return await UserModel.deleteOne({ guid: guid }).orFail().exec();
  } catch (e) {
    throw new Error(`Could not find user profile`);
  }
};

export const purgeUsers = async () => {
  try {
    const time = getUnixTime(subMonths(new Date(), 3));
    await UserModel.find({ lastLogin: { $lt: time } }).exec();
  } catch (e: any) {
    throw new Error(e);
  }
};
