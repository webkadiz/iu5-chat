import React, {
  ChangeEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  TextField,
} from '@mui/material';

import { ActiveChatContext } from '../../context/active-chat';
import { filterBy } from '../../utils';
import styled from '@emotion/styled';
import { Chat } from '../../types';

type Props = {
  chats: Chat[];
};

const ChatList = ({ chats }: Props) => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (chats.length) {
      setActiveChat(chats[0]);
    } else {
      setActiveChat(null);
    }
  }, [chats, setActiveChat]);

  const selectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    setSearch(value);
  };

  const filterChats = chats.filter(filterBy(search, 'name'));

  return (
    <>
      <StyledSearch
        variant="outlined"
        value={search}
        onChange={onSearch}
        placeholder="Поиск"
      />
      <List>
        {filterChats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={activeChat?.id === chat.id}
            onClick={() => selectChat(chat)}
          >
            <ListItemAvatar>
              <Avatar src={chat.avatar}>{chat.name[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            {chat.name}
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

const StyledSearch = styled(TextField)`
  margin: 10px 20px;

  input {
    padding: 10px;
  }
`;

export default ChatList;
