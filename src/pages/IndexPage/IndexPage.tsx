import {
  Button,
  Container,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import CreateRoomModal from './CreateRoomModal';

export default function IndexPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Container>
        <VStack spacing="16">
          <Heading>Kokaon</Heading>
          <VStack spacing="12">
            <Button size="lg" w="sm" h="20" onClick={onOpen}>
              ルームを作る
            </Button>
            <Button size="lg" w="sm" h="20">
              ルームに参加する
            </Button>
          </VStack>
        </VStack>
      </Container>
      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
