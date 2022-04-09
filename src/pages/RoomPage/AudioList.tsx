import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { FaPause, FaPlay } from 'react-icons/fa';
import Room, { AudioData } from '../../room';
import { useAudio } from './hooks';

export type AudioListProps = {
  room: Room;
  audios: AudioData[];
};

export default function AudioList({ room, audios }: AudioListProps) {
  return (
    <Box as="ul">
      {audios.map((audio) => (
        <Box key={audio.id} as="li">
          <AudioListItem room={room} audio={audio} />
        </Box>
      ))}
    </Box>
  );
}

function AudioListItem({ room, audio }: { room: Room; audio: AudioData }) {
  const { isRejected, onAllow, isPlaying, isPlayable, onPause, onPlay } =
    useAudio(room, audio);

  return (
    <Flex justifyContent="space-between" alignItems="center" h="10">
      <Box>{audio.name}</Box>
      {isRejected ? (
        <Button size="sm" onClick={onAllow}>
          再生を許可する
        </Button>
      ) : (
        <IconButton
          size="sm"
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          aria-label="再生"
          isLoading={!isPlayable}
          onClick={isPlaying ? onPause : onPlay}
        />
      )}
    </Flex>
  );
}
