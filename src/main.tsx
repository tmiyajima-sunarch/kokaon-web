import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ApiClientProvider } from './api';
import { StompRoomClientFactory } from './api/room';
import RoomClientFactoryProvider from './api/room/RoomClientFactoryProvider';

const baseUrl =
  (import.meta.env.VITE_BASE_URL as string | undefined) ||
  'http://localhost:8080';

const stompUrl =
  (import.meta.env.VITE_STOMP_URL as string | undefined) || `${baseUrl}/stomp`;

const roomClientFactory = new StompRoomClientFactory(stompUrl);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <HashRouter>
        <ColorModeScript />
        <ApiClientProvider baseUrl={baseUrl}>
          <RoomClientFactoryProvider factory={roomClientFactory}>
            <App />
          </RoomClientFactoryProvider>
        </ApiClientProvider>
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
