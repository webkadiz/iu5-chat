import React, { ForwardedRef, forwardRef } from 'react';
import styled from '@emotion/styled';

import { useCurrentUser } from '../../state/current-user/slice';
import EmojiList from '../emoji/EmojiList';
import {
  Avatar,
  List,
  ListItemButton,
  Popover,
  PopoverOrigin,
} from '@mui/material';
import { useState } from 'react';
import moment from 'moment';
import { Message, User } from '../../types';
import ReactionList from '../reaction/ReactionList';

type Props = {
  messages: Message[];
  onReply: (message: Message) => void;
};

const ChatMessageList = forwardRef(
  ({ messages, onReply }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const currentUser = useCurrentUser();
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [openContextMenu, setOpenContextMenu] = useState(false);
    const [anchorOrigin, setAnchorOrigin] = useState<PopoverOrigin>({
      vertical: 'top',
      horizontal: 'left',
    });
    const [transformOrigin, setTransformOrigin] = useState<PopoverOrigin>({
      vertical: 'top',
      horizontal: 'left',
    });
    const [messageForContextMenu, setMessageForContextMenu] =
      useState<Message | null>(null);

    const messageGroups = separateMessagesByUser(messages);

    const handleOpenContextMenu = (
      e: React.MouseEvent<HTMLDivElement>,
      message: Message
    ) => {
      e.preventDefault();

      const isRightSide = isCurrentUserMessage(currentUser, message);
      const isTopSide = e.clientY < window.innerHeight / 2;

      setActiveMessage(message);
      setAnchorEl(e.currentTarget);
      setOpenContextMenu(true);
      setAnchorOrigin({
        vertical: isTopSide ? 'top' : 'bottom',
        horizontal: isRightSide ? 'left' : 'right',
      });
      setTransformOrigin({
        vertical: isTopSide ? 'top' : 'bottom',
        horizontal: isRightSide ? 'right' : 'left',
      });
      setMessageForContextMenu(message);
    };

    const handleMessageReply = () => {
      if (!activeMessage) return;

      onReply(activeMessage);
    };

    return (
      <StyledChatMessageList ref={ref}>
        {messageGroups.map((messages, i) => (
          <MessageGroupContainer
            key={i}
            current={isCurrentUserMessage(currentUser, messages[0])}
          >
            {!isCurrentUserMessage(currentUser, messages[0]) && (
              <MessageAvatar>
                {messages[0].userFrom.username[0].toUpperCase()}
              </MessageAvatar>
            )}
            <MessageGroup
              current={isCurrentUserMessage(currentUser, messages[0])}
            >
              {messages.map((message) => (
                <MessageBox
                  key={message.id}
                  onContextMenu={(e) => handleOpenContextMenu(e, message)}
                  current={isCurrentUserMessage(currentUser, messages[0])}
                >
                  <MessageContent
                    dangerouslySetInnerHTML={{
                      __html: message.content,
                    }}
                  ></MessageContent>
                  <MessageMeta>
                    <ReactionList reactions={message.reactions} />
                    <MessageTime>
                      {moment(message.timeCreated).format('hh:mm')}
                    </MessageTime>
                  </MessageMeta>
                </MessageBox>
              ))}
            </MessageGroup>
            {isCurrentUserMessage(currentUser, messages[0]) && (
              <MessageAvatar>
                {messages[0].userFrom.username[0].toUpperCase()}
              </MessageAvatar>
            )}
          </MessageGroupContainer>
        ))}
        <StyledPopover
          open={openContextMenu}
          anchorEl={anchorEl}
          onClose={() => setOpenContextMenu(false)}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        >
          <EmojiList message={messageForContextMenu} />
          <List>
            {/* <ListItemButton onClick={handleMessageReply}>
              Ответить
            </ListItemButton>
            <ListItemButton>Изменить</ListItemButton>
            <ListItemButton>Копировать</ListItemButton>
            <ListItemButton>Удалить</ListItemButton> */}
          </List>
        </StyledPopover>
      </StyledChatMessageList>
    );
  }
);

const isCurrentUserMessage = (currentUser: User | null, message: Message) => {
  if (!currentUser) return false;

  return message.userFrom.id === currentUser.id;
};

const separateMessagesByUser = (messages: Message[]) => {
  let user = null;
  let group: Message[] = [];
  const groups = [];

  for (const message of messages) {
    if (message.userFrom.id !== user && group.length) {
      groups.push(group);
      group = [];
      user = message.userFrom.id;
    }

    group.push(message);
  }

  group.length && groups.push(group);

  return groups;
};

const StyledChatMessageList = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 15px;
  overflow-y: scroll;
`;

const MessageGroupContainer = styled.div<{ current: boolean }>`
  display: flex;
  align-self: ${(p) => (p.current ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const MessageGroup = styled.div<{ current: boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;

  > div:last-child {
    border-radius: ${(p) =>
      p.current ? '8px 8px 0px 8px' : '8px 8px 8px 0px'};
  }
`;

const MessageBox = styled.div<{ current: boolean }>`
  display: flex;
  background: ${(p) => (p.current ? '#91d47b' : 'white')};
  align-self: ${(p) => (p.current ? 'flex-end' : 'flex-start')};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 2px;
  text-align: left;
`;

const MessageContent = styled.span`
  text-align: left;
  // min-width: 150px;

  p {
    margin: 0;
  }
`;

const MessageMeta = styled.span`
  display: flex;
  align-items: center;
  align-self: flex-end;
  margin-left: 10px;
  margin-bottom: -2px;
`;

const MessageTime = styled.span`
  font-size: 12px;
`;

const MessageAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: auto;
`;

const StyledPopover = styled(Popover)`
  //
`;

export default ChatMessageList;
