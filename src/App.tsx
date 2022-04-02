import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const IndexPage = lazy(() => import('./pages/IndexPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));

function App() {
  return (
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
  );
}

export default App;
