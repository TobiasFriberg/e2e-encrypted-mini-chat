import { CountryCodes, Gender } from './utils';

export interface IUser {
  _id?: string;
  name?: string;
  created?: number;
  guid?: string;
  password?: string;
}
