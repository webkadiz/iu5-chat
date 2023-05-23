import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';

import FetchWrapper from '../common/FetchWrapper';
import ChatList from './ChatList';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { getChats } from '../../back';
import Queries from '../../queries';

type Props = {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const ChatNav: React.FC<Props> = ({ setDrawerOpen }) => {
  return (
    <ChatListContainer>
      <MenuButton>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <Menu />
        </IconButton>
      </MenuButton>
      <FetchWrapper
        queryKey={Queries.chat.getChats}
        fetchFn={async () => await getChats()}
        render={({ data }) => {
          return <ChatList chats={data || []} />;
        }}
      />
    </ChatListContainer>
  );
};

const ChatListContainer = styled.div`
  height: 100%;
  width: 300px;
  border-right: 1px solid black;
  overflow-y: scroll;
`;

const MenuButton = styled.div`
  display: flex;
  padding-left: 16px;
  padding-top: 8px;
`;

export default ChatNav;
