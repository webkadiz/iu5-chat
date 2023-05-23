import { useContext, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { ActiveChatContext } from '../../context/active-chat';
import FetchWrapper from '../common/FetchWrapper';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';
import MessageReplyPreview from '../message/MessageReplyPreview';
import { Message } from '../../types';
import TopToolbar from './TopToolbar';
import { toast } from 'react-toastify';
import { deleteChat, getMessages } from '../../back';
import { useQueryClient } from 'react-query';
import Queries from '../../queries';

const SCROLL_END = 100000;

const ChatSpace = () => {
  const { activeChat } = useContext(ActiveChatContext);
  const [messageReply, setMessageReply] = useState<Message | null>(null);
  const [scrollPosition, setScrollPosition] = useState(SCROLL_END);
  const listRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const qc = useQueryClient();

  const onReply = (message: Message) => {
    setMessageReply(message);

    if (messageInputRef.current) {
      console.log('reply', messageInputRef.current);
      messageInputRef.current.focus();
    }
  };

  const onSend = () => {
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
            queryOptions={{ refetchInterval: 5000 }}
            emptyEl={<ChatMessageEmptyList />}
            render={({ data }) => {
              return (
                <ChatMessageList
                  messages={data}
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
