import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  InputRightAddon,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Link as RouterLink,
  Navigate,
  useHref,
  useParams,
} from 'react-router-dom';
import AudioDropzone from './AudioDropzone';
import MemberList from './MemberList';
import AudioList from './AudioList';
import { useRoomClient } from './hooks';
import { loadLocalStorage } from '../../local-storage';
import { FaCheck, FaCopy } from 'react-icons/fa';
import icon from '../../icon.svg';

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
  const { roomClient, state } = useRoomClient(roomId, passcode, nickname);
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

  if (!roomClient || !state || !state.me || !state.room) {
    return <>Loading...</>;
  }

  return (
    <Container py="8">
      <Helmet>
        <title>{state.room.name} | Kokaon WEB</title>
      </Helmet>
      <VStack spacing="8" alignItems="stretch">
        <VStack spacing="2" alignItems="stretch">
          <RoomPageHeader>{state.room.name}</RoomPageHeader>
          <hr />
          <HStack spacing="4" alignItems="end">
            <Text>
              <Badge>ID</Badge> {state.room.id}
            </Text>
            <Text>
              <Badge>パスコード</Badge> {state.room.passcode}
            </Text>
          </HStack>
        </VStack>
        <VStack spacing="4" alignItems="stretch">
          <Heading size="sm">URL</Heading>
          <Text>参加者にこのURLを共有してください</Text>
          <RoomUrlCopyInput roomId={roomId} passcode={passcode} size="sm" />
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
              roomClient={roomClient}
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

function RoomPageHeader({ children }: { children: ReactNode }) {
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>{children}</Heading>
        <Tooltip label="退室する">
          <HStack spacing="2" as={RouterLink} to="/">
            <Text color="gray.400" fontFamily="mono">
              Kokaon
            </Text>
            <Image src={icon} w="6" />
          </HStack>
        </Tooltip>
      </Flex>
    </Box>
  );
}

function RoomUrlCopyInput({
  label,
  roomId,
  passcode,
  ...props
}: {
  label?: ReactNode;
  roomId: string;
  passcode: string;
} & InputGroupProps) {
  const href = useHref(`/enter?r=${roomId}&p=${passcode}`);
  const url = useMemo(
    () =>
      `${window.location.protocol}//${window.location.host}${
        import.meta.env.BASE_URL
      }${href}`,
    [href]
  );

  return <CopyInput label={label} value={url} {...props} />;
}

function CopyInput({
  label,
  value,
  size,
  ...props
}: { label?: ReactNode; value: string } & InputGroupProps) {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <InputGroup size={size} {...props}>
      {label ? <InputLeftAddon>{label}</InputLeftAddon> : null}
      <SelectOnFocusInput type="text" value={value} readOnly />
      <InputRightAddon p="0">
        <Tooltip label="Copy to clipboard">
          <IconButton
            icon={hasCopied ? <FaCheck /> : <FaCopy />}
            size={size}
            aria-label="コピー"
            onClick={onCopy}
          />
        </Tooltip>
      </InputRightAddon>
    </InputGroup>
  );
}

function SelectOnFocusInput({
  onFocus,
  ...props
}: React.ComponentProps<typeof Input>) {
  const ref = useRef<HTMLInputElement>(null!);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      ref.current.select();
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );

  return <Input ref={ref} onFocus={handleFocus} {...props} />;
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
