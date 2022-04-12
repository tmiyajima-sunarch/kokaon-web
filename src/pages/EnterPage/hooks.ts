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
      let result: Result = 'success';

      try {
        await callApi(
          async () => {
            const { ok } = await client.validateRoom(
              values.roomId,
              values.passcode
            );
            if (!ok) {
              result = 'invalid-passcode';
            }
          },
          { retries: 4 }
        );
      } catch (e) {
        console.error(e);

        if (e instanceof ResponseError) {
          switch (e.status) {
            case 404:
              result = 'room-not-found';
              break;
            default:
              result = 'other-error';
              break;
          }
        } else if (e instanceof TransportError) {
          result = 'connection-error';
        } else {
          result = 'other-error';
        }
      }

      return result;
    },
    [client]
  );

  return validateRoom;
}
