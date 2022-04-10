import { Box, Center, Container, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AudioDropzone from './AudioDropzone';
import MemberList from './MemberList';
import AudioList from './AudioList';
import { useRoom } from './hooks';
import { loadLocalStorage } from '../../local-storage';

export default function RoomPage() {
  const { roomId } = useParams<'roomId'>();
  assertDefined(roomId, 'roomId');

  const nickname = loadLocalStorage<string>('nickname');
  const passcode = loadLocalStorage<string>(`passcodes.${roomId}`);

  if (!nickname || !passcode) {
    return <Navigate to={`/enter?r=${roomId}`} />;
  }

  return <RoomDetail roomId={roomId} passcode={passcode} nickname={nickname} />;
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
