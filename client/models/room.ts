import ApiFetch from '../components/apifetch';
import { Options } from '../interface/api';

export function getRoom(username: string): any {
  const options: Options = {
    url: '/api/room',
    method: 'POST',
    body: {
      user: username,
    },
  };

  return ApiFetch(options);
}

export function getMyRooms(): any {
  const options: Options = {
    url: `/api/rooms`,
    method: 'GET',
  };

  return ApiFetch(options);
}

export function getMyRoomInfo(roomId: string): any {
  const options: Options = {
    url: `/api/room/${roomId}`,
    method: 'GET',
  };

  return ApiFetch(options);
}

export function saveTtlForRoom(roomId: string, ttl: number): any {
  const options: Options = {
    url: `/api/room/${roomId}`,
    method: 'POST',
    body: { ttl: ttl },
  };

  return ApiFetch(options);
}

export function deleteRoom(roomId: string): any {
  const options: Options = {
    url: `/api/room/${roomId}`,
    method: 'DELETE',
  };

  return ApiFetch(options);
}
