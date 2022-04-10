import {
  Box,
  Center,
  Container,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import AudioDropzone from './AudioDropzone';
import MemberList from './MemberList';
import AudioList from './AudioList';
import { useRoom, useLocalStorage } from './hooks';
import SetNicknameModal, { SetNicknameModalValues } from './SetNicknameModal';

export default function RoomPage() {
  const { roomId } = useParams<'roomId'>();
  assertDefined(roomId, 'roomId');

  const [search] = useSearchParams();
  const passcode = search.get('p');

  const [nickname, setNickname] = useLocalStorage('nickname', '');
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const onSubmit = useCallback(
    ({ nickname }: SetNicknameModalValues) => {
      setNickname(nickname);
      onClose();
    },
    [onClose, setNickname]
  );

  if (!passcode) {
    return <>パスコードがありません</>;
  }

  return (
    <>
      {!isOpen && (
        <RoomDetail roomId={roomId} passcode={passcode} nickname={nickname} />
      )}
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
  passcode,
  nickname,
}: {
  roomId: string;
  passcode: string;
  nickname: string;
}) {
  const { room, state } = useRoom(roomId, passcode, nickname);

  if (!room || !state || !state.me || !state.room) {
    return <>Loading...</>;
  }

  return (
    <Container>
      <VStack spacing="8" alignItems="stretch">
        <Heading>ルーム: {state.room.name}</Heading>
        <Box as="dl">
          <dt>ID</dt>
          <dd>{state.room.id}</dd>
          <dt>パスコード</dt>
          <dd>{state.room.passcode}</dd>
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
          {state.room.audios.length === 0 ? (
            <Empty>効果音はありません</Empty>
          ) : (
            <AudioList room={room} audios={state.room.audios} />
          )}
          <AudioDropzone roomId={roomId} />
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
