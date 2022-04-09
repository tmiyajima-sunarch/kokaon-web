import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import Room, { AudioData } from '../../room';

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

function useAudio(room: Room, audio: AudioData) {
  const [isPlayable, setPlayable] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const player = useMemo(
    () => new Audio(`http://localhost:8080${audio.url}`),
    [audio.url]
  );

  useEffect(() => {
    const onCanPlay = () => setPlayable(true);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    player.addEventListener('canplay', onCanPlay);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    const play = async () => {
      try {
        await player.play();
        player.pause();
        setRejected(false);
      } catch {
        setRejected(true);
      }
    };

    play();

    return () => {
      player.removeEventListener('canplay', onCanPlay);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, [player]);

  useEffect(() => {
    const onPlay = async ({ audioId }: { audioId: string }) => {
      if (audioId !== audio.id) {
        return;
      }

      console.log('Play:', audio.id, audio.name);
      try {
        await player.play();
        setRejected(false);
      } catch {
        setRejected(true);
      }
    };

    room.on('play', onPlay);

    return () => {
      room.off('play', onPlay);
    };
  }, [audio.id, audio.name, player, room]);

  const onAllow = useCallback(async () => {
    try {
      await player.play();
      player.pause();
      setRejected(false);
    } catch (e) {
      console.error(e);
      setRejected(true);
    }
  }, [player]);

  const onPlay = useCallback(() => {
    room.play(audio.id);
  }, [audio.id, room]);

  const onPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
      player.currentTime = 0;
    }
  }, [isPlaying, player]);

  return {
    isRejected,
    onAllow,
    isPlayable,
    isPlaying,
    onPlay,
    onPause,
  };
}
