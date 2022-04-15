import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ApiClientProvider } from './api';

const baseUrl =
  (import.meta.env.VITE_BASE_URL as string | undefined) ||
  'http://localhost:8080';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <ColorModeScript />
        <ApiClientProvider baseUrl={baseUrl}>
          <App />
        </ApiClientProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
