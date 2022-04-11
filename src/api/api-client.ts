import { ApiClient } from './types';

export class ApiClientImpl implements ApiClient {
  constructor(public readonly baseUrl: string) {}

  async createRoom(name: string): Promise<{
    roomId: string;
    passcode: string;
  }> {
    const res = await fetch(`${this.baseUrl}/api/v1/room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new ResponseError(res);
    }

    return await res.json();
  }

  async validateRoom(
    roomId: string,
    passcode: string
  ): Promise<{
    roomId: string;
    ok: boolean;
  }> {
    const res = await fetch(`${this.baseUrl}/api/v1/room/${roomId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passcode }),
    });

    if (!res.ok) {
      throw new ResponseError(res);
    }

    return await res.json();
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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('audioFile', file);

    const res = await fetch(`${this.baseUrl}/room/${roomId}/audios`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new ResponseError(res);
    }

    return await res.json();
  }
}

export class ResponseError extends Error {
  constructor(
    public readonly response: Response,
    message?: string,
    options?: ErrorOptions
  ) {
    super(message ? message : `status code: ${response.status}`, options);
    this.name = 'ResponseError';
  }

  get status(): number {
    return this.response.status;
  }

  get json(): Promise<any> {
    return this.response.json();
  }
}
