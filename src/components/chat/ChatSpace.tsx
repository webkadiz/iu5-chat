import { useContext, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { orderBy } from 'lodash';

import { ActiveChatContext } from '../../context/active-chat';
import FetchWrapper from '../common/FetchWrapper';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';
import MessageReplyPreview from '../message/MessageReplyPreview';
import { Message } from '../../types';
import TopToolbar from './TopToolbar';
import { toast } from 'react-toastify';
import { CreateMessageDto, deleteChat, getMessages } from '../../back';
import { useQueryClient } from 'react-query';
import Queries from '../../queries';
import { useCurrentUser } from '../../state/current-user/slice';

const SCROLL_END = 100000;

const ChatSpace = () => {
  const { activeChat } = useContext(ActiveChatContext);
  const currentUser = useCurrentUser();
  const [messageReply, setMessageReply] = useState<Message | null>(null);
  const [scrollPosition, setScrollPosition] = useState(SCROLL_END);
  const listRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);

  const qc = useQueryClient();

  useEffect(() => {
    console.log(activeChat);
    if (!activeChat || !currentUser) return;

    const ws = new WebSocket('ws://localhost:3001');
    console.log(ws);

    setWsInstance(ws);

    ws.onopen = () => {
      const message = {
        event: 'chatConnect',
        chatId: activeChat.id,
        userId: currentUser.id,
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);

      qc.invalidateQueries(Queries.chat.getMessages(activeChat.id));
    };

    return () => {
      ws.close();
    };
  }, [activeChat]);

  const onReply = (message: Message) => {
    setMessageReply(message);

    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const onSend = (message: CreateMessageDto) => {
    if (!currentUser) return;

    closeMessageReply();

    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scroll({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 1000);

    if (messageInputRef.current) messageInputRef.current.focus();

    wsInstance?.send(
      JSON.stringify({
        event: 'addMessage',
        userId: currentUser.id,
        ...message,
      })
    );
  };

  const closeMessageReply = () => {
    setMessageReply(null);
  };

  const deleteChatHandler = async () => {
    if (!activeChat) return;

    try {
      await deleteChat(activeChat.id);

      qc.invalidateQueries(Queries.chat.getChats);

      toast.success('Чат удален');
    } catch (e) {
      toast.error('Не удалось удалить чат');
    }
  };

  return (
    <ChatContainer>
      {activeChat && (
        <>
          <TopToolbar onDelete={deleteChatHandler} />
          <FetchWrapper
            queryKey={Queries.chat.getMessages(activeChat.id)}
            fetchFn={async () => await getMessages(activeChat.id)}
            emptyEl={<ChatMessageEmptyList />}
            render={({ data }) => {
              const ordered = orderBy(data || [], ['timeCreated'], 'asc');

              return (
                <ChatMessageList
                  messages={ordered}
                  onReply={onReply}
                  ref={listRef}
                />
              );
            }}
          />
          <InputBox>
            {messageReply && (
              <MessageReplyPreview
                message={messageReply}
                onClose={closeMessageReply}
              />
            )}
            <ChatMessageInput
              onSend={onSend}
              messageInputRef={messageInputRef}
            />
          </InputBox>
        </>
      )}
    </ChatContainer>
  );
};

const ChatMessageEmptyList = styled.div`
  flex-grow: 1;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: url('/chat-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
`;

const InputBox = styled.div`
  flex-shrink: 0;
`;

export default ChatSpace;
