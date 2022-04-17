import { Box, Button, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { useCallback } from 'react';
import { FaMinusCircle, FaPause, FaPlay } from 'react-icons/fa';
import { useApiClient } from '../../api';
import { AudioData, RoomClient } from '../../api/room';
import { useWarnToast } from '../../hooks';
import { useAudio, useRemoveAudio } from './hooks';
import { List, ListItem } from './List';

export type AudioListProps = {
  roomClient: RoomClient;
  roomId: string;
  audios: AudioData[];
  isEditing?: boolean;
};

export default function AudioList({
  roomClient,
  roomId,
  audios,
  isEditing = false,
}: AudioListProps) {
  return (
    <List>
      {audios.map((audio) => (
        <ListItem key={audio.id}>
          <AudioListItem
            roomClient={roomClient}
            roomId={roomId}
            audio={audio}
            isEditing={isEditing}
          />
        </ListItem>
      ))}
    </List>
  );
}

function AudioListItem({
  roomClient,
  roomId,
  audio,
  isEditing,
}: {
  roomClient: RoomClient;
  roomId: string;
  audio: AudioData;
  isEditing: boolean;
}) {
  const client = useApiClient();
  const { isRejected, onAllow, isPlaying, isPlayable, onPause, onPlay } =
    useAudio(roomClient, audio, client.baseUrl);

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
          colorScheme="blue"
          variant="ghost"
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
