import { useContext } from 'react';
import { RoomClientFactoryContext } from './context';

export function useRoomClientFactory() {
  const client = useContext(RoomClientFactoryContext);
  if (!client) {
    throw new Error(
      "'useRoomClientFactory()' must be used under <RoomClientFactoryProvider />"
    );
  }
  return client;
}
