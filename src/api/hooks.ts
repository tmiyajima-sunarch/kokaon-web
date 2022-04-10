import { useContext } from 'react';
import { ApiClientContext } from './context';

export function useApiClient() {
  const client = useContext(ApiClientContext);
  if (!client) {
    throw new Error(
      "'useApiClient()' must be used under <ApiClientProvider />"
    );
  }
  return client;
}
