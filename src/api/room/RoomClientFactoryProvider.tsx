import { ReactNode } from 'react';
import { RoomClientFactoryContext } from './context';
import { RoomClientFactory } from './types';

export type RoomClientFactoryProviderProps = {
  factory: RoomClientFactory;
  children: ReactNode;
};

export default function RoomClientFactoryProvider({
  factory,
  children,
}: RoomClientFactoryProviderProps) {
  return (
    <RoomClientFactoryContext.Provider value={factory}>
      {children}
    </RoomClientFactoryContext.Provider>
  );
}
