import ApiFetch from '../components/apifetch';
import { Options } from '../interface/api';
import { IUser } from '../interface/user';

export function fetchProfile(token: string): any {
  const options: Options = {
    url: '/api/user/profile',
    method: 'POST',
    headers: new Headers({
      'x-csrf': token,
    }),
  };

  return ApiFetch(options);
}

export function fetchProfileById(id: string): any {
  const options: Options = {
    url: `/api/user/profile/${id}`,
    method: 'GET',
  };

  return ApiFetch(options);
}

export function createUser(user: IUser): Promise<any> {
  const options: Options = {
    url: '/api/user/create',
    method: 'POST',
    body: user,
  };

  return ApiFetch(options);
}

export function loginUser(user: { name: string; password: string }): Promise<any> {
  const options: Options = {
    url: '/api/user',
    method: 'POST',
    body: { name: user.name, password: user.password },
  };

  return ApiFetch(options);
}

export function saveUser(newPassword: string, oldPassword: string): Promise<any> {
  const options: Options = {
    url: '/api/user/save',
    method: 'POST',
    body: { password: newPassword, oldPassword: oldPassword },
  };

  return ApiFetch(options);
}

export function removeUser(password: string): Promise<any> {
  const options: Options = {
    url: '/api/user',
    method: 'DELETE',
    body: { password: password },
  };

  return ApiFetch(options);
}
