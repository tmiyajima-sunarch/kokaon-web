import {
  Button,
  Container,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import CreateRoomModal from './CreateRoomModal';
import EnterRoomModal from './EnterRoomModal';

export default function IndexPage() {
  const createRoomModalDisclosure = useDisclosure();
  const enterRoomModalDisclosure = useDisclosure();

  return (
    <>
      <Container>
        <VStack spacing="16">
          <Heading>Kokaon</Heading>
          <VStack spacing="12">
            <Button
              size="lg"
              w="sm"
              h="20"
              onClick={createRoomModalDisclosure.onOpen}
            >
              ルームを作る
            </Button>
            <Button
              size="lg"
              w="sm"
              h="20"
              onClick={enterRoomModalDisclosure.onOpen}
            >
              ルームに参加する
            </Button>
          </VStack>
        </VStack>
      </Container>
      <CreateRoomModal
        isOpen={createRoomModalDisclosure.isOpen}
        onClose={createRoomModalDisclosure.onClose}
      />
      <EnterRoomModal
        isOpen={enterRoomModalDisclosure.isOpen}
        onClose={enterRoomModalDisclosure.onClose}
      />
    </>
  );
}
