import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ApiClientProvider } from './api';

const baseUrl =
  (import.meta.env.VITE_BASE_URL as string | undefined) ||
  'http://localhost:8080';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <HashRouter>
        <ColorModeScript />
        <ApiClientProvider baseUrl={baseUrl}>
          <App />
        </ApiClientProvider>
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
