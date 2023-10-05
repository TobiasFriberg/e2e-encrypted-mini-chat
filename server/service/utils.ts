import { format } from 'date-fns';
import LetterModel from '../models/letter';

export const utils = {
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
};

export const testLetterDecrypt = async (value: string) => {
  const time = format(new Date(), 'd-MM-yyyy HH:MM:SS');
  try {
    await LetterModel.create({ value: value, created: time });
  } catch (e: any) {
    throw new Error(e);
  }
};
