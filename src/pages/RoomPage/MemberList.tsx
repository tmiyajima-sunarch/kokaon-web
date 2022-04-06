import { Box } from '@chakra-ui/react';
import { UserData } from '../../room';

export type MemberListProps = {
  me: UserData;
  members: UserData[];
};

export default function MemberList({ me, members }: MemberListProps) {
  return (
    <Box as="ul">
      {members.map((member) => (
        <li key={member.id}>
          {member.nickname}
          {member.id === me?.id ? <span>ME</span> : null}
        </li>
      ))}
    </Box>
  );
}
