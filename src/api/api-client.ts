import webstomp from 'webstomp-client';
import SockJs from '../sockjs';
import Room from '../room';
import {
  ClientError,
  ResponseBodyError,
  ResponseError,
  ServerError,
  TransportError,
} from './errors';
import { ApiClient } from './types';

export class ApiClientImpl implements ApiClient {
  constructor(public readonly baseUrl: string) {}

  newRoomInstance(roomId: string, passcode: string): Room {
    const stompUrl = `${this.baseUrl}/stomp`;
    const socket = new SockJs(stompUrl);
    const stompClient = webstomp.over(socket);
    return new Room(stompClient, roomId, passcode);
  }

  async createRoom(name: string): Promise<{
    roomId: string;
    passcode: string;
  }> {
    return this.template(() =>
      fetch(`${this.baseUrl}/api/v1/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
    );
  }

  async validateRoom(
    roomId: string,
    passcode: string
  ): Promise<{
    roomId: string;
    ok: boolean;
  }> {
    return this.template(() =>
      fetch(`${this.baseUrl}/api/v1/room/${roomId}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      })
    );
  }

  async addAudio(
    roomId: string,
    file: File,
    name: string
  ): Promise<{
    roomId: string;
    audioId: string;
    audioName: string;
  }> {
    return this.template(() => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('audioFile', file);

      return fetch(`${this.baseUrl}/room/${roomId}/audios`, {
        method: 'POST',
        body: formData,
      });
    });
  }

  async removeAudio(
    roomId: string,
    audioId: string
  ): Promise<{ roomId: string; audioId: string }> {
    return this.template(() =>
      fetch(`${this.baseUrl}/api/v1/room/${roomId}/audios/${audioId}`, {
        method: 'DELETE',
      })
    );
  }

  private async template<T>(call: () => Promise<Response>): Promise<T> {
    let res: Response;
    try {
      res = await call();
    } catch (e) {
      throw new TransportError(undefined, { cause: e as Error });
    }

    if (!res.ok) {
      if (res.status >= 400 && res.status < 500) {
        throw new ClientError(res);
      }
      if (res.status >= 500) {
        throw new ServerError(res);
      }
      throw new ResponseError(res);
    }

    try {
      return await res.json();
    } catch (e) {
      throw new ResponseBodyError(res, undefined, { cause: e as Error });
    }
  }
}
