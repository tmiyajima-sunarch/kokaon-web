import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Tooltip,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Navigate, useHref, useParams } from 'react-router-dom';
import AudioDropzone from './AudioDropzone';
import MemberList from './MemberList';
import AudioList from './AudioList';
import { useRoom } from './hooks';
import { loadLocalStorage } from '../../local-storage';
import { FaCheck, FaCopy } from 'react-icons/fa';

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
  const [isAudioEditing, toggleAudioEditing, setAudioEditing] =
    useToggle(false);

  useEffect(() => {
    if (state?.room?.audios.length === 0 && isAudioEditing) {
      setAudioEditing(false);
    }
  }, [
    isAudioEditing,
    setAudioEditing,
    state?.room?.audios.length,
    toggleAudioEditing,
  ]);

  if (!room || !state || !state.me || !state.room) {
    return <>Loading...</>;
  }

  return (
    <Container>
      <VStack spacing="8" alignItems="stretch">
        <Heading>ルーム: {state.room.name}</Heading>
        <VStack>
          <HStack>
            <CopyInput label="ID" value={state.room.id} />
            <CopyInput label="パスコード" value={state.room.passcode} />
          </HStack>
          <RoomUrlCopyInput label="URL" roomId={roomId} passcode={passcode} />
        </VStack>
        <VStack spacing="4" alignItems="stretch">
          <Heading size="sm">メンバー</Heading>
          {state.room.members.length === 0 ? (
            <Empty>メンバーはいません</Empty>
          ) : (
            <MemberList me={state.me} members={state.room.members} />
          )}
        </VStack>
        <VStack spacing="4" alignItems="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="sm">効果音</Heading>
            <Button
              variant="outline"
              size="xs"
              colorScheme="blackAlpha"
              disabled={state.room.audios.length === 0}
              onClick={toggleAudioEditing}
            >
              {isAudioEditing ? '編集の終了' : '編集'}
            </Button>
          </Flex>
          {state.room.audios.length === 0 ? (
            <Empty>効果音はありません</Empty>
          ) : (
            <AudioList
              room={room}
              roomId={roomId}
              audios={state.room.audios}
              isEditing={isAudioEditing}
            />
          )}
          <AudioDropzone roomId={roomId} />
        </VStack>
      </VStack>
    </Container>
  );
}

function RoomUrlCopyInput({
  label,
  roomId,
  passcode,
}: {
  label?: ReactNode;
  roomId: string;
  passcode: string;
}) {
  const href = useHref(`/enter?r=${roomId}&p=${passcode}`);
  const url = useMemo(
    () =>
      `${window.location.protocol}//${window.location.host}${
        import.meta.env.BASE_URL
      }${href}`,
    [href]
  );

  return <CopyInput label={label} value={url} />;
}

function CopyInput({ label, value }: { label?: ReactNode; value: string }) {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <InputGroup>
      {label ? <InputLeftAddon>{label}</InputLeftAddon> : null}
      <Input type="text" value={value} readOnly />
      <InputRightAddon p="0">
        <Tooltip label="Copy to clipboard">
          <IconButton
            icon={hasCopied ? <FaCheck /> : <FaCopy />}
            aria-label="コピー"
            onClick={onCopy}
          />
        </Tooltip>
      </InputRightAddon>
    </InputGroup>
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

function useToggle(initial: boolean) {
  const [flag, setFlag] = useState(initial);

  const toggle = useCallback(() => {
    setFlag((flag) => !flag);
  }, []);

  return [flag, toggle, setFlag] as const;
}
