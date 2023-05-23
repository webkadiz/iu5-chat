import styled from '@emotion/styled';
import { Avatar } from '@mui/material';
import React from 'react';
import { UserShort } from '../../types';

type Props = {
  user: UserShort;
};

const UserInfoItem: React.FC<Props> = ({ user }) => {
  const colors = [
    '#f54e42',
    '#d99652',
    '#e6d647',
    '#aacf46',
    '#33bd2b',
    '#3db8b1',
    '#2274bd',
    '#2522bd',
    '#8722bd',
    '#bd2294',
  ];
  const colorIdx = user.username.length % colors.length;
  const color = colors[colorIdx];

  return (
    <Container>
      <StyledAvatar src={user.avatar} color={color}>
        {user.username[0].toUpperCase()}
      </StyledAvatar>
      <Title>{user.username}</Title>
    </Container>
  );
};

const genUserAvatarFromName = (firstName: string, lastName: string) => {
  return firstName[0] + lastName[1];
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)<{ color?: string }>`
  //
  background-color: ${(p) => (p.color ? p.color : '#bdbdbd')};
`;

const Title = styled.div`
  font-weight: 500;
  margin-left: 10px;
`;

export default UserInfoItem;
