export type RoomClientState = {
  me: UserData | null;
  room: RoomData | null;
};

export type RoomData = {
  id: string;
  passcode: string;
  name: string;
  members: UserData[];
  audios: AudioData[];
};

export type UserData = {
  id: string;
  nickname: string;
};

export type AudioData = {
  id: string;
  name: string;
  url: string;
};

export type RoomClientEvents = {
  change: RoomClientState;
  play: {
    audioId: string;
  };
};

export interface RoomClient {
  on<K extends Extract<keyof RoomClientEvents, string>>(
    eventName: K,
    listener: (arg: RoomClientEvents[K]) => void
  ): this;

  off<K extends Extract<keyof RoomClientEvents, string>>(
    eventName: K,
    listener: (arg: RoomClientEvents[K]) => void
  ): this;

  connect(): Promise<void>;

  init(): Promise<void>;

  enter(id: string, nickname: string): void;

  play(audioId: string): void;

  close(): void;
}

export interface RoomClientFactory {
  create(options: { roomId: string; passcode: string }): RoomClient;
}
