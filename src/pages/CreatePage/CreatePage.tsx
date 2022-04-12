import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from './CreateRoomModal';
import { useCreateRoom } from './hooks';

export default function CreatePage() {
  const navigate = useNavigate();

  const createRoom = useCreateRoom();

  const onClose = useCallback(() => {
    navigate('/', {
      replace: true,
    });
  }, [navigate]);

  return <CreateRoomModal isOpen onClose={onClose} onSubmit={createRoom} />;
}
