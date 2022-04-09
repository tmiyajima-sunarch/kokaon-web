import {
  Box,
  Center,
  Container,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AddAudioForm from './AddAudioForm';
import MemberList from './MemberList';
import AudioList from './AudioList';
import { useLocalStorage, useRoom } from './hooks';
import SetNicknameModal, { SetNicknameModalValues } from './SetNicknameModal';

export default function RoomPage() {
  const { roomId } = useParams<'roomId'>();
  assertDefined(roomId, 'roomId');

  const [nickname, setNickname] = useLocalStorage('nickname', '');
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const onSubmit = useCallback(
    ({ nickname }: SetNicknameModalValues) => {
      setNickname(nickname);
      onClose();
    },
    [onClose, setNickname]
  );

  return (
    <>
      {!isOpen && <RoomDetail roomId={roomId} nickname={nickname} />}
      <SetNicknameModal
        isOpen={isOpen}
        onClose={onClose}
        defaultValues={{ nickname }}
        onSubmit={onSubmit}
      />
    </>
  );
}

function RoomDetail({
  roomId,
  nickname,
}: {
  roomId: string;
  nickname: string;
}) {
  const { room, state } = useRoom(roomId, nickname);

  if (!room || !state || !state.me || !state.room) {
    return <>Loading...</>;
  }

  return (
    <Container>
      <VStack spacing="8" alignItems="stretch">
        <Heading>ルーム: {state.room?.name}</Heading>
        <Box as="dl">
          <dt>ID</dt>
          <dd>{state.room?.id}</dd>
          <dt>パスコード</dt>
          <dd>123456789</dd>
        </Box>
        <VStack spacing="4" alignItems="stretch">
          <Heading size="sm">メンバー</Heading>
          {state.room.members.length === 0 ? (
            <Empty>メンバーはいません</Empty>
          ) : (
            <MemberList me={state.me} members={state.room.members} />
          )}
        </VStack>
        <VStack spacing="4" alignItems="stretch">
          <Heading size="sm">効果音</Heading>
          {state.room?.audios.length === 0 ? (
            <Empty>効果音はありません</Empty>
          ) : (
            <AudioList room={room} audios={state.room.audios} />
          )}
          <AddAudioForm roomId={roomId} />
        </VStack>
      </VStack>
    </Container>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Center p="8" borderWidth="1px" borderColor="gray.200">
      {children}
    </Center>
  );
}

function assertDefined<T>(
  value: T | undefined,
  name: string
): asserts value is T {
  if (value === undefined) {
    throw new Error(`The ${name} is undefined`);
  }
}
