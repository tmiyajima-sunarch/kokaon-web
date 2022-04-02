import { Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export default function RoomPage() {
  const { roomId } = useParams<'roomId'>();
  assertDefined(roomId, 'roomId');

  return <Heading>RoomPage: {roomId}</Heading>;
}

function assertDefined<T>(
  value: T | undefined,
  name: string
): asserts value is T {
  if (value === undefined) {
    throw new Error(`The ${name} is undefined`);
  }
}
