import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  callApi,
  ResponseError,
  TransportError,
  useApiClient,
} from '../../api';
import { CreateRoomModalValues } from './CreateRoomModal';

export function useCreateRoom() {
  const navigate = useNavigate();
  const client = useApiClient();
  const toast = useToast();

  const showInfoMessage = useCallback(
    (message: string) => {
      toast({
        description: message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const showWarnMessage = useCallback(
    (message: string) => {
      toast({
        description: message,
        status: 'warning',
        duration: 10000,
        isClosable: true,
      });
    },
    [toast]
  );

  const createRoom = useCallback(
    async (values: CreateRoomModalValues) => {
      try {
        await callApi(
          async () => {
            const { roomId, passcode } = await client.createRoom(values.name);

            showInfoMessage('ルームが作成されました');

            navigate(`/enter?r=${roomId}&p=${passcode}`, {
              replace: true,
            });
          },
          { retries: 4 }
        );
      } catch (e) {
        console.error(e);

        if (e instanceof ResponseError) {
          showWarnMessage(`${e.status}: ${e.message}`);
        } else if (e instanceof TransportError) {
          showWarnMessage(
            '接続エラーが発生しました。しばらく経ってから再度お試しください。'
          );
        } else {
          showWarnMessage(
            '不明なエラーが発生しました。しばらく経ってから再度お試しください。'
          );
        }
      }
    },
    [client, navigate, showInfoMessage, showWarnMessage]
  );

  return createRoom;
}
