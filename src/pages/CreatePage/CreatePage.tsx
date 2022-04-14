import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoomModal, { CreateRoomModalValues } from './CreateRoomModal';
import { useCreateRoom } from './hooks';

export default function CreatePage() {
  const navigate = useNavigate();

  const createRoom = useCreateRoom();

  const onClose = useCallback(() => {
    navigate('/', {
      replace: true,
    });
  }, [navigate]);

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

  const onSubmit = useCallback(
    async (values: CreateRoomModalValues) => {
      const result = await createRoom(values);

      if (result.ok) {
        const { roomId, passcode } = result;
        showInfoMessage('ルームが作成されました');

        navigate(`/enter?r=${roomId}&p=${passcode}`, {
          replace: true,
        });
      } else {
        switch (result.reason) {
          case 'connection-error':
            showWarnMessage(
              '接続エラーが発生しました。しばらく経ってから再度お試しください。'
            );
            break;
          case 'other-error':
            showWarnMessage(
              '不明なエラーが発生しました。しばらく経ってから再度お試しください。'
            );
            break;
        }
      }
    },
    [createRoom, navigate, showInfoMessage, showWarnMessage]
  );

  return <CreateRoomModal isOpen onClose={onClose} onSubmit={onSubmit} />;
}
