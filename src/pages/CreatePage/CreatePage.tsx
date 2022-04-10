import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../api';
import CreateRoomModal, { CreateRoomModalValues } from './CreateRoomModal';

export default function CreatePage() {
  const navigate = useNavigate();
  const client = useApiClient();

  const onClose = useCallback(() => {
    navigate('/', {
      replace: true,
    });
  }, [navigate]);

  const onSubmit = useCallback(
    async (values: CreateRoomModalValues) => {
      const { roomId, passcode } = await client.createRoom(values.name);
      navigate(`/enter?r=${roomId}&p=${passcode}`, {
        replace: true,
      });
    },
    [client, navigate]
  );

  return <CreateRoomModal isOpen onClose={onClose} onSubmit={onSubmit} />;
}
