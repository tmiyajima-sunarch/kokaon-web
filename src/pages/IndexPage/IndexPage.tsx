import { Button, Container, Heading, VStack } from '@chakra-ui/react';
import { Suspense, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function IndexPage() {
  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    navigate('/create', {
      replace: true,
    });
  }, [navigate]);

  const onEnter = useCallback(() => {
    navigate('/enter', {
      replace: true,
    });
  }, [navigate]);

  return (
    <>
      <Container>
        <VStack spacing="16">
          <Heading>Kokaon</Heading>
          <VStack spacing="12">
            <Button size="lg" w="sm" h="20" onClick={onCreate}>
              ルームを作る
            </Button>
            <Button size="lg" w="sm" h="20" onClick={onEnter}>
              ルームに参加する
            </Button>
          </VStack>
        </VStack>
      </Container>
      <Suspense fallback="Loading...">
        <Outlet />
      </Suspense>
    </>
  );
}
