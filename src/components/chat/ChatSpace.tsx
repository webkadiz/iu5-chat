import { useContext, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { Message } from '../../api/generated/models/Message';
import { MessageService } from '../../api/generated/services/MessageService';
import { ActiveChatContext } from '../../context/active-chat';
import FetchWrapper from '../common/FetchWrapper';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';
import MessageReplyPreview from '../message/MessageReplyPreview';

const SCROLL_END = 100000;

const ChatSpace = () => {
    const { activeChat } = useContext(ActiveChatContext);
    const [messageReply, setMessageReply] = useState<Message | null>(null);
    const [scrollPosition, setScrollPosition] = useState(SCROLL_END);
    const listRef = useRef<HTMLDivElement>(null);

    const onReply = (message: Message) => {
        setMessageReply(message);
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
    };

    const closeMessageReply = () => {
        setMessageReply(null);
    };

    return (
        <ChatContainer>
            {activeChat && (
                <>
                    <FetchWrapper<Message[]>
                        queryKey={activeChat.id.toString()}
                        fetchFn={async () =>
                            await MessageService.getMessagesByChat(
                                activeChat.id
                            )
                        }
                        queryOptions={{ refetchInterval: 3000 }}
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
                        <ChatMessageInput onSend={onSend} />
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
