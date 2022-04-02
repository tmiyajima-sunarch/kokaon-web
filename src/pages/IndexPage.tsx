import { Button, Container, Heading, VStack } from '@chakra-ui/react';

export default function IndexPage() {
  return (
    <Container>
      <VStack spacing="16" w="full">
        <Heading>Kokaon</Heading>
        <VStack spacing="12" w="full">
          <Button size="lg" w="sm" h="20">
            ルームを作る
          </Button>
          <Button size="lg" w="sm" h="20">
            ルームに参加する
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
