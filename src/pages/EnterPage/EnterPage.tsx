import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  loadLocalStorage,
  saveLocalStorage,
  useLocalStorage,
} from '../../local-storage';
import EnterRoomModal, { EnterRoomModalValues } from './EnterRoomModal';

export default function EnterPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('r');
  let passcode = searchParams.get('p');

  const [nickname, setNickname] = useLocalStorage<string>('nickname', '');

  const navigate = useNavigate();

  const onClose = useCallback(() => {
    navigate('/', {
      replace: true,
    });
  }, [navigate]);

  const onSubmit = useCallback(
    (values: EnterRoomModalValues) => {
      saveLocalStorage(`passcodes.${roomId}`, values.passcode);
      setNickname(values.nickname);
      navigate(`/room/${values.roomId}`, {
        replace: true,
      });
    },
    [navigate, roomId, setNickname]
  );

  if (!passcode && roomId) {
    passcode = loadLocalStorage(`passcodes.${roomId}`);
  }

  const defaultValues: EnterRoomModalValues = useMemo(
    () => ({
      roomId: roomId || '',
      passcode: passcode || '',
      nickname,
    }),
    [nickname, passcode, roomId]
  );

  return (
    <EnterRoomModal
      isOpen
      onClose={onClose}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    />
  );
}
