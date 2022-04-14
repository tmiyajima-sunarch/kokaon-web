import { useCallback } from 'react';
import {
  callApi,
  ResponseError,
  TransportError,
  useApiClient,
} from '../../api';
import { EnterRoomModalValues } from './EnterRoomModal';

type Result =
  | 'success'
  | 'room-not-found'
  | 'invalid-passcode'
  | 'connection-error'
  | 'other-error';

export function useValidateRoom() {
  const client = useApiClient();

  const validateRoom = useCallback(
    async (values: EnterRoomModalValues): Promise<Result> => {
      try {
        return await callApi(
          async () => {
            const { ok } = await client.validateRoom(
              values.roomId,
              values.passcode
            );

            return ok ? 'success' : 'invalid-passcode';
          },
          { retries: 4 }
        );
      } catch (e) {
        console.error(e);

        if (e instanceof ResponseError) {
          switch (e.status) {
            case 404:
              return 'room-not-found';
            default:
              return 'other-error';
          }
        } else if (e instanceof TransportError) {
          return 'connection-error';
        } else {
          return 'other-error';
        }
      }
    },
    [client]
  );

  return validateRoom;
}
