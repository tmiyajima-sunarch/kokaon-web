import { Avatar, Badge, Box, Spacer } from '@chakra-ui/react';
import { UserData } from '../../api/room';
import { List, ListItem } from './List';

export type MemberListProps = {
  me: UserData;
  members: UserData[];
};

export default function MemberList({ me, members }: MemberListProps) {
  return (
    <List>
      {members.map((member) => (
        <ListItem
          key={member.id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Avatar name={member.nickname} size="sm" mr="2" />
          <Box>{member.nickname}</Box>
          <Spacer />
          {member.id === me?.id ? (
            <Badge px="2" py="1" colorScheme="blue">
              あなた
            </Badge>
          ) : null}
        </ListItem>
      ))}
    </List>
  );
}
