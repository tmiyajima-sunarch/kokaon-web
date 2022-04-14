import { Box, Button, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { useCallback } from 'react';
import { FaMinusCircle, FaPause, FaPlay } from 'react-icons/fa';
import { useWarnToast } from '../../hooks';
import Room, { AudioData } from '../../room';
import { useAudio, useRemoveAudio } from './hooks';

export type AudioListProps = {
  room: Room;
  roomId: string;
  audios: AudioData[];
  isEditing?: boolean;
};

export default function AudioList({
  room,
  roomId,
  audios,
  isEditing = false,
}: AudioListProps) {
  return (
    <Box as="ul" listStyleType="none">
      {audios.map((audio) => (
        <Box key={audio.id} as="li">
          <AudioListItem
            room={room}
            roomId={roomId}
            audio={audio}
            isEditing={isEditing}
          />
        </Box>
      ))}
    </Box>
  );
}

function AudioListItem({
  room,
  roomId,
  audio,
  isEditing,
}: {
  room: Room;
  roomId: string;
  audio: AudioData;
  isEditing: boolean;
}) {
  const { isRejected, onAllow, isPlaying, isPlayable, onPause, onPlay } =
    useAudio(room, audio);

  const [removeAudio, isRemoving] = useRemoveAudio();
  const warnToast = useWarnToast();

  const onRemove = useCallback(async () => {
    const result = await removeAudio(roomId, audio.id);
    if (!result.ok) {
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
  }, [audio.id, removeAudio, roomId, warnToast]);

  return (
    <Flex justifyContent="space-between" alignItems="center" h="10">
      {isEditing ? (
        <IconButton
          size="sm"
          icon={<FaMinusCircle />}
          variant="ghost"
          colorScheme="red"
          aria-label="削除"
          isLoading={isRemoving}
          onClick={onRemove}
        />
      ) : (
        <IconButton
          size="sm"
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          aria-label="再生"
          disabled={isRejected || isRemoving}
          isLoading={!isPlayable}
          onClick={isPlaying ? onPause : onPlay}
        />
      )}
      <Box ml="2">{audio.name}</Box>
      <Spacer />
      {!isEditing && isRejected ? (
        <Button size="sm" onClick={onAllow}>
          再生を許可する
        </Button>
      ) : null}
    </Flex>
  );
}
