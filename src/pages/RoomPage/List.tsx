import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type ListProps = {
  children?: ReactNode;
} & BoxProps;

export function List({ children, ...props }: ListProps) {
  return (
    <Box
      as="ul"
      listStyleType="none"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      {...props}
    >
      {children}
    </Box>
  );
}

export type ListItemProps = {
  children?: ReactNode;
} & BoxProps;

export function ListItem({ children, ...props }: ListProps) {
  return (
    <Box
      as="li"
      borderTop="1px"
      borderColor="gray.200"
      _first={{ borderTop: 0 }}
      p="2"
      {...props}
    >
      {children}
    </Box>
  );
}
