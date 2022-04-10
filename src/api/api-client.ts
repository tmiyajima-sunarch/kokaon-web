import { ApiClient } from './types';

export class ApiClientImpl implements ApiClient {
  constructor(public readonly baseUrl: string) {}

  async createRoom(name: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/v1/room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const { roomId } = await res.json();

    return roomId;
  }

  async validateRoom(roomId: string, passcode: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/api/v1/room/${roomId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passcode }),
    });

    const { ok } = await res.json();

    return ok;
  }

  async addAudio(roomId: string, file: File, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('audioFile', file);

    await fetch(`${this.baseUrl}/room/${roomId}/audios`, {
      method: 'POST',
      body: formData,
    });
  }
}
