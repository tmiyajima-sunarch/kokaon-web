import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  callApi,
  ResponseError,
  TransportError,
  useApiClient,
} from '../../api';
import CreateRoomModal, { CreateRoomModalValues } from './CreateRoomModal';

export default function CreatePage() {
  const navigate = useNavigate();
  const client = useApiClient();
  const toast = useToast();

  const onClose = useCallback(() => {
    navigate('/', {
      replace: true,
    });
  }, [navigate]);

  const onSubmit = useCallback(
    async (values: CreateRoomModalValues) => {
      try {
        await callApi(
          async () => {
            const { roomId, passcode } = await client.createRoom(values.name);

            navigate(`/enter?r=${roomId}&p=${passcode}`, {
              replace: true,
            });

            toast({
              description: 'ルームが作成されました',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          },
          {
            retries: 4,
          }
        );
      } catch (e) {
        console.error(e);
        if (e instanceof ResponseError) {
          toast({
            description: `${e.status}: ${e.message}`,
            status: 'warning',
            duration: 10000,
            isClosable: true,
          });
        } else if (e instanceof TransportError) {
          toast({
            description:
              '接続エラーが発生しました。しばらく経ってから再度お試しください。',
            status: 'warning',
            duration: 10000,
            isClosable: true,
          });
        } else {
          toast({
            description:
              '不明なエラーが発生しました。しばらく経ってから再度お試しください。',
            status: 'warning',
            duration: 10000,
            isClosable: true,
          });
        }
      }
    },
    [client, navigate, toast]
  );

  return <CreateRoomModal isOpen onClose={onClose} onSubmit={onSubmit} />;
}
