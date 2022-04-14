import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfoToast, useWarnToast } from '../../hooks';
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

  const infoToast = useInfoToast();
  const warnToast = useWarnToast();

  const onSubmit = useCallback(
    async (values: CreateRoomModalValues) => {
      const result = await createRoom(values);

      if (result.ok) {
        const { roomId, passcode } = result;
        infoToast({ description: 'ルームが作成されました' });

        navigate(`/enter?r=${roomId}&p=${passcode}`, {
          replace: true,
        });
      } else {
        switch (result.reason) {
          case 'connection-error':
            warnToast({
              description:
                '接続エラーが発生しました。しばらく経ってから再度お試しください。',
            });
            break;
          case 'other-error':
            warnToast({
              description:
                '不明なエラーが発生しました。しばらく経ってから再度お試しください。',
            });
            break;
        }
      }
    },
    [createRoom, infoToast, navigate, warnToast]
  );

  return <CreateRoomModal isOpen onClose={onClose} onSubmit={onSubmit} />;
}
