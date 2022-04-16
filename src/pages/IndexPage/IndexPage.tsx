import {
  Button,
  Container,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Suspense, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import icon from '../../icon.svg';

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
      <Container py="8">
        <Helmet>
          <title>Kokaon WEB</title>
        </Helmet>
        <VStack spacing="16">
          <VStack spacing="4">
            <Heading size="2xl" fontFamily="mono">
              Kokaon
            </Heading>
            <Image src={icon} w="60" />
            <Text color="gray.500">オンライン会議を効果音で盛り上げよう</Text>
          </VStack>
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
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
