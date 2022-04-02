import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, Route, Routes } from 'react-router-dom';

const IndexPage = lazy(() => import('./pages/IndexPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));

function App() {
  return (
    <ErrorBoundary
      fallbackRender={(error) => <div>Error: {error.error.message}</div>}
    >
      <Suspense fallback="Loading...">
        <div>
          <div>
            <Link to="/">Home</Link>|<Link to="/room/abc">Room</Link>
          </div>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
