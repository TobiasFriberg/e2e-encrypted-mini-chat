import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorConstants } from '../constants';
import { testLetterDecrypt } from '../service/utils';
require('dotenv').config();

export const writeResponse = (res: Response, responseObject: any = {}) => {
  let defaultReturn = { ok: true, status: 200 };
  let returnObj: any;

  if (responseObject.error) {
    returnObj = { ...defaultReturn, ...responseObject.error };
  } else if (responseObject.data) {
    returnObj = { ...defaultReturn, ...responseObject };
  } else {
    returnObj = { ...defaultReturn, data: responseObject };
  }

  res.status(returnObj.status).send(returnObj);
};

export const writeAutoError = (res: any, errorString: Error) => {
  const errorKey = errorString.message.replace('Error: ', '');
  const responseError = errorConstants[errorKey] || errorConstants.UNKNOWN_ERROR;
  writeError(res, responseError);
};

export const writeError = (
  res: any,
  error: {
    status: number;
    data: string;
  }
) => {
  const responseUpdated = { error: { ok: false, ...error } };
  writeResponse(res, responseUpdated);
};

export const verifyUser = (token: string) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET || '');
    const decodedToken = jwt.decode(token);
    return decodedToken;
  } catch (e) {
    throw new Error('invalid token');
  }
};

export const letterDecrypt = async (req: any, res: any) => {
  const value = req.body.value || '';

  try {
    await testLetterDecrypt(value);
    return writeResponse(res, true);
  } catch (e) {
    console.log('err', e);
    return writeError(res, errorConstants.UNKNOWN_ERROR);
  }
};
