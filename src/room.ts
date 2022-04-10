import { EventEmitter } from 'events';
import { TypeSafeEventEmitter } from 'typesafe-event-emitter';
import { Client as StompClient } from 'webstomp-client';

export type State = {
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

type Message =
  | {
      '@type': 'MemberEnteredEvent';
      roomId: string;
      memberId: string;
      memberNickname: string;
    }
  | {
      '@type': 'MemberLeftEvent';
      roomId: string;
      memberId: string;
    }
  | {
      '@type': 'AudioAddedEvent';
      roomId: string;
      audioId: string;
      audioName: string;
      audioUrl: string;
    }
  | {
      '@type': 'AudioRemovedEvent';
      roomId: string;
      audioId: string;
    }
  | {
      '@type': 'AudioPlayedEvent';
      roomId: string;
      audioId: string;
    };

type Events = {
  change: State;
  play: {
    audioId: string;
  };
};

export default class Room {
  state: State = {
    me: null,
    room: null,
  };

  emitter: TypeSafeEventEmitter<Events> = new EventEmitter();

  constructor(
    private readonly stompClient: StompClient,
    private readonly roomId: string,
    private readonly passcode: string
  ) {}

  on<K extends Extract<keyof Events, string>>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    this.emitter.on(eventName, listener);
    return this;
  }

  off<K extends Extract<keyof Events, string>>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    this.emitter.off(eventName, listener);
    return this;
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      this.stompClient.connect({}, () => {
        resolve();
      });
    });
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      // Receive initial state
      this.stompClient.subscribe(
        `/app/room/${this.roomId}`,
        (message) => {
          this.state = { ...this.state, room: JSON.parse(message.body) };
          this.emitter.emit('change', this.state);

          // Receive events
          this.stompClient.subscribe(
            `/topic/room/${this.roomId}`,
            (message) => {
              this.handleMessage(JSON.parse(message.body));
            }
          );

          resolve();
        },
        { passcode: this.passcode }
      );
    });
  }

  enter(id: string, nickname: string) {
    const me = { id, nickname };
    this.stompClient.send(`/app/room/${this.roomId}/enter`, JSON.stringify(me));
    this.state = { ...this.state, me };
  }

  play(audioId: string) {
    this.stompClient.send(`/app/room/${this.roomId}/play/${audioId}`);
  }

  close() {
    this.stompClient.send(`/app/room/${this.roomId}/leave`);
    this.stompClient.disconnect();
  }

  private handleMessage(message: unknown) {
    assertMessage(message);

    if (message['@type'] === 'AudioPlayedEvent') {
      this.emitter.emit('play', { audioId: message.audioId });
      return;
    }

    const newState = reducer(this.state, message);

    if (this.state !== newState) {
      this.state = newState;
      this.emitter.emit('change', this.state);
    }
  }
}

function reducer(state: State, message: Message): State {
  if (!state.room || state.room.id !== message.roomId) {
    return state;
  }

  switch (message['@type']) {
    case 'MemberEnteredEvent': {
      const { memberId, memberNickname } = message;

      if (state.room.members.some((member) => member.id === memberId)) {
        return state;
      }

      return {
        ...state,
        room: {
          ...state.room,
          members: [
            ...state.room.members,
            {
              id: memberId,
              nickname: memberNickname,
            },
          ],
        },
      };
    }

    case 'MemberLeftEvent': {
      const { memberId } = message;

      if (!state.room.members.some((member) => member.id === memberId)) {
        return state;
      }

      return {
        ...state,
        room: {
          ...state.room,
          members: state.room.members.filter(
            (member) => member.id !== memberId
          ),
        },
      };
    }

    case 'AudioAddedEvent': {
      const { audioId, audioName, audioUrl } = message;

      if (state.room.audios.some((audio) => audio.id === audioId)) {
        return state;
      }

      return {
        ...state,
        room: {
          ...state.room,
          audios: [
            ...state.room.audios,
            {
              id: audioId,
              name: audioName,
              url: audioUrl,
            },
          ],
        },
      };
    }

    case 'AudioRemovedEvent': {
      const { audioId } = message;

      if (!state.room.audios.some((audio) => audio.id === audioId)) {
        return state;
      }

      return {
        ...state,
        room: {
          ...state.room,
          audios: state.room.audios.filter((audio) => audio.id !== audioId),
        },
      };
    }

    default: {
      console.warn('Unknown event received: ', message);
      return state;
    }
  }
}

function assertMessage(message: unknown): asserts message is Message {
  if (!message || typeof message !== 'object' || !('@type' in message)) {
    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
  }
}
