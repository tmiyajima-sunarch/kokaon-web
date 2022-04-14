import { useCallback } from 'react';
import {
  callApi,
  ResponseError,
  TransportError,
  useApiClient,
} from '../../api';
import { CreateRoomModalValues } from './CreateRoomModal';

type Result =
  | {
      ok: true;
      roomId: string;
      passcode: string;
    }
  | {
      ok: false;
      reason: 'connection-error' | 'other-error';
    };

export function useCreateRoom() {
  const client = useApiClient();

  const createRoom = useCallback(
    async (values: CreateRoomModalValues): Promise<Result> => {
      try {
        return await callApi(
          async () => {
            const { roomId, passcode } = await client.createRoom(values.name);

            return {
              ok: true,
              roomId,
              passcode,
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

  return createRoom;
}
