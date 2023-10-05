import { getSocketId } from '../socket';
import { errorConstants } from '../constants';
import {
  createUser,
  loginUser,
  getUserProfile,
  getUserProfileById,
  removeUser,
  saveUser,
} from '../service/userService';
import { writeError, writeResponse } from './utils';

export const registerUser = async (req: any, res: any) => {
  const password = req.body.password;
  const name = req.body.name.trim();

  if (name.length >= 25 || password.length >= 100) {
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }

  try {
    await createUser({
      password,
      name,
    });
    return writeResponse(res, true);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const login = async (req: any, res: any) => {
  const name = req.body.name.trim();
  const password = req.body.password;

  try {
    const user = await loginUser(name, password);
    return writeResponse(res, user);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const getUserByToken = async (req: any, res: any) => {
  const token = req.token.guid || '';
  try {
    const user: any = await getUserProfile(token);
    return writeResponse(res, user);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const getUserById = async (req: any, res: any) => {
  const token = req.token.guid || '';
  const id = req.params.id || '';

  try {
    const user: any = await getUserProfileById(token, id);
    return writeResponse(res, {
      _id: id,
      name: user.profile.name,
    });
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const updateUser = async (req: any, res: any) => {
  const token = req.token.guid || '';
  const password = req.body.password || '';
  const oldPassword = req.body.oldPassword || '';

  try {
    await saveUser(password, oldPassword, token);
    return writeResponse(res, true);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};

export const deleteAccount = async (req: any, res: any) => {
  const token = req.token.guid || '';
  const password = req.body.password || '';

  try {
    await removeUser(token, password);
    return writeResponse(res, true);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};
