import { useCallback, useEffect, useMemo, useState } from 'react';
import webstomp from 'webstomp-client';
import SockJs from '../../sockjs';
import Room, { AudioData, State } from '../../room';
import {
  callApi,
  ResponseError,
  TransportError,
  useApiClient,
} from '../../api';

const baseUrl = 'http://localhost:8080';

export function useRoom(roomId: string, passcode: string, nickname: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const stompUrl = `${baseUrl}/stomp`;
    const socket = new SockJs(stompUrl);
    const stompClient = webstomp.over(socket);
    const room = new Room(stompClient, roomId, passcode);

    setRoom(room);
    room.on('change', (state) => setState(state));

    async function init() {
      await room.connect();
      await room.init();

      const id = Math.random().toString(32).substring(2);

      room.enter(id, nickname);
    }

    init();

    return () => {
      room?.close();
      setRoom(null);
    };
  }, [nickname, passcode, roomId]);

  return {
    room,
    state,
  };
}

export function useAudio(room: Room, audio: AudioData) {
  const [isPlayable, setPlayable] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const player = useMemo(
    () => new Audio(`${baseUrl}${audio.url}`),
    [audio.url]
  );

  useEffect(() => {
    const onCanPlay = () => setPlayable(true);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    player.addEventListener('canplay', onCanPlay);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    const play = async () => {
      try {
        await player.play();
        player.pause();
        setRejected(false);
      } catch {
        setRejected(true);
      }
    };

    play();

    return () => {
      player.removeEventListener('canplay', onCanPlay);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, [player]);

  useEffect(() => {
    const onPlay = async ({ audioId }: { audioId: string }) => {
      if (audioId !== audio.id) {
        return;
      }

      console.log('Play:', audio.id, audio.name);
      try {
        await player.play();
        setRejected(false);
      } catch {
        setRejected(true);
      }
    };

    room.on('play', onPlay);

    return () => {
      room.off('play', onPlay);
    };
  }, [audio.id, audio.name, player, room]);

  const onAllow = useCallback(async () => {
    try {
      await player.play();
      player.pause();
      setRejected(false);
    } catch (e) {
      console.error(e);
      setRejected(true);
    }
  }, [player]);

  const onPlay = useCallback(() => {
    room.play(audio.id);
  }, [audio.id, room]);

  const onPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
      player.currentTime = 0;
    }
  }, [isPlaying, player]);

  return {
    isRejected,
    onAllow,
    isPlayable,
    isPlaying,
    onPlay,
    onPause,
  };
}

export function useAddAudios() {
  const client = useApiClient();
  const [isLoading, setLoading] = useState(false);

  type FileResult =
    | {
        ok: true;
      }
    | {
        ok: false;
        reason: 'connection-error' | 'other-error';
      };

  type Result =
    | {
        ok: true;
      }
    | {
        ok: false;
        results: FileResult[];
      };

  const addAudio = useCallback(
    async (roomId: string, file: File): Promise<FileResult> => {
      try {
        return await callApi(
          async () => {
            await client.addAudio(roomId, file, file.name);

            return {
              ok: true,
            };
          },
          { retries: 4 }
        );
      } catch (e) {
        console.error(e);

        if (e instanceof ResponseError) {
          return {
            ok: false,
            reason: 'other-error',
          };
        } else if (e instanceof TransportError) {
          return {
            ok: false,
            reason: 'connection-error',
          };
        } else {
          return {
            ok: false,
            reason: 'other-error',
          };
        }
      }
    },
    [client]
  );

  const addAudios = useCallback(
    async (roomId: string, files: File[]): Promise<Result> => {
      setLoading(true);
      const promises = files.map((file) => addAudio(roomId, file));
      const results = await Promise.all(promises);
      setLoading(false);

      const ok = results.every((result) => result.ok);
      if (ok) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          results: results,
        };
      }
    },
    [addAudio]
  );

  return [addAudios, isLoading] as const;
}

export function useRemoveAudio() {
  const client = useApiClient();
  const [isLoading, setLoading] = useState(false);

  type Result =
    | {
        ok: true;
      }
    | {
        ok: false;
        reason: 'connection-error' | 'other-error';
      };

  const removeAudio = useCallback(
    async (roomId: string, audioId: string): Promise<Result> => {
      setLoading(true);
      try {
        return await callApi(
          async () => {
            await client.removeAudio(roomId, audioId);

            return {
              ok: true,
            };
          },
          { retries: 4 }
        );
      } catch (e) {
        console.error(e);

        if (e instanceof ResponseError) {
          return {
            ok: false,
            reason: 'other-error',
          };
        } else if (e instanceof TransportError) {
          return {
            ok: false,
            reason: 'connection-error',
          };
        } else {
          return {
            ok: false,
            reason: 'other-error',
          };
        }
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  return [removeAudio, isLoading] as const;
}
