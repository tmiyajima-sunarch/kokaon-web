import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const IndexPage = lazy(() => import('./pages/IndexPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));

function App() {
  return (
    <Box minH="100vh">
      <ErrorBoundary
        fallbackRender={(error) => <div>Error: {error.error.message}</div>}
      >
        <Suspense fallback="Loading...">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
}

export default App;
