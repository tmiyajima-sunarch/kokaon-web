import { ReactNode, useMemo } from 'react';
import { ApiClientImpl } from './api-client';
import { ApiClientContext } from './context';

export type ApiClientProviderProps = {
  baseUrl: string;
  children: ReactNode;
};

export default function ApiClientProvider({
  baseUrl,
  children,
}: ApiClientProviderProps) {
  const client = useMemo(() => new ApiClientImpl(baseUrl), [baseUrl]);

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}
