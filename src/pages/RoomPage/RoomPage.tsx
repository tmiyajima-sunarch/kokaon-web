import { Box, Center, Container, Heading, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import webstomp from 'webstomp-client';
import SockJs from '../../sockjs';
import Room, { State } from '../../room';
import AddAudioForm from './AddAudioForm';
import MemberList from './MemberList';
import AudioList from './AudioList';

export default function RoomPage() {
  const { roomId } = useParams<'roomId'>();
  assertDefined(roomId, 'roomId');

  const [room, setRoom] = useState<Room | null>(null);
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const stompUrl = 'http://localhost:8080/stomp';
    const socket = new SockJs(stompUrl);
    const stompClient = webstomp.over(socket);
    const room = new Room(stompClient, roomId);

    setRoom(room);
    room.on('change', (state) => setState(state));

    async function init() {
      await room.connect();
      await room.init();

      const id = Math.random().toString(32).substring(2);

      room.enter(id, 'test');
    }

    init();

    return () => {
      room?.close();
      setRoom(null);
    };
  }, [roomId]);

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
