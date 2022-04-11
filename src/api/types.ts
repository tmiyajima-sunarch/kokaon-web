export interface ApiClient {
  createRoom(name: string): Promise<{
    roomId: string;
    passcode: string;
  }>;

  validateRoom(
    roomId: string,
    passcode: string
  ): Promise<{
    roomId: string;
    ok: boolean;
  }>;

  addAudio(
    roomId: string,
    file: File,
    name: string
  ): Promise<{
    roomId: string;
    audioId: string;
    audioName: string;
  }>;
}
