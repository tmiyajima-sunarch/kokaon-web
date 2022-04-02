import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { Box, Link } from '@chakra-ui/react';

const IndexPage = lazy(() => import('./pages/IndexPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));

function App() {
  return (
    <ErrorBoundary
      fallbackRender={(error) => <div>Error: {error.error.message}</div>}
    >
      <Suspense fallback="Loading...">
        <Box minH="100vh">
          <div>
            <Link as={RouterLink} to="/">
              Home
            </Link>
            |
            <Link as={RouterLink} to="/room/abc">
              Room
            </Link>
          </div>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
