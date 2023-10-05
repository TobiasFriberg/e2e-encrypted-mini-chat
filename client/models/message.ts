import ApiFetch from '../components/apifetch';
import { Options } from '../interface/api';

export function getMessageForRoom(room: string, page = 0): Promise<any> {
  const options: Options = {
    url: `/api/messages/${room}/${page}`,
    method: 'GET',
  };

  return ApiFetch(options);
}

export function getMessageFromId(room: string, messageId: string): Promise<any> {
  const options: Options = {
    url: `/api/message/${room}/${messageId}`,
    method: 'GET',
  };

  return ApiFetch(options);
}

export function sendMessage(room: string, message: string): Promise<any> {
  const options: Options = {
    url: `/api/message`,
    method: 'POST',
    body: {
      room: room,
      message: message,
    },
  };

  return ApiFetch(options);
}

export function saveChatImage(room: string, message: string, image: string, fileName: string): Promise<any> {
  const options: Options = {
    url: '/api/message/img',
    method: 'POST',
    body: { image: image, fileName: fileName, room: room, message: message },
  };

  return ApiFetch(options);
}
