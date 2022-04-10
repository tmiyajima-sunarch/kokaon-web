import { createContext } from 'react';
import { ApiClient } from './types';

export const ApiClientContext = createContext<ApiClient | null>(null);
