import { useToast, UseToastOptions } from '@chakra-ui/react';

export function useInfoToast(options?: UseToastOptions) {
  return useToast({
    status: 'success',
    duration: 5000,
    isClosable: true,
    ...options,
  });
}

export function useWarnToast(options?: UseToastOptions) {
  return useToast({
    status: 'success',
    duration: 10000,
    isClosable: true,
    ...options,
  });
}
