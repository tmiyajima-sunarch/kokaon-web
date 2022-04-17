import { ReactNode } from 'react';
import { ApiClientContext } from './context';
import { ApiClient } from './types';

export type ApiClientProviderProps = {
  client: ApiClient;
  children: ReactNode;
};

export default function ApiClientProvider({
  client,
  children,
}: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}
