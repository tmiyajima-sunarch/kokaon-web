import { createContext } from 'react';
import { RoomClientFactory } from './types';

export const RoomClientFactoryContext = createContext<RoomClientFactory | null>(
  null
);
