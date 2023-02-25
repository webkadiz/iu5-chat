import React from 'react';
import styled from '@emotion/styled';

import { Message } from '../../api/generated/models/Message';
import { User } from '../../api/generated/models/User';
import { useCurrentUser } from '../../state/current-user/slice';

type Props = {
    messages: Message[];
};

const ChatMessageList = ({ messages }: Props) => {
    const currentUser = useCurrentUser();

    const messageGroups = separateMessagesByUser(messages);

    console.log(messageGroups);

    // isCurrentUserMessage(currentUser, message) ? (
    return (
        <StyledChatMessageList>
            {messageGroups.map((messages) => (
                <MessageGroup>
                    {messages.map((message) => (
                        <StyledMessage
                            key={message.id}
                            current={isCurrentUserMessage(currentUser, message)}
                        >
                            {message.content}
                        </StyledMessage>
                    ))}
                </MessageGroup>
            ))}
        </StyledChatMessageList>
    );
};

const isCurrentUserMessage = (currentUser: User, message: Message) => {
    return message.fromId == currentUser.id;
};

const separateMessagesByUser = (messages: Message[]) => {
    let user = null;
    let group: Message[] = [];
    const groups = [];

    for (const message of messages) {
        if (message.fromId !== user && group.length) {
            groups.push(group);
            group = [];
            user = message.fromId;
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
`;

const LeftMessage = styled.div`
    align-self: start;
    background: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
`;

const RightMessage = styled.div`
    align-self: end;
    background: #91d47b;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
`;

const MessageGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const StyledMessage = styled.div<{current: boolean}>`
    align-self: ${p => p.current ? 'flex-end' : 'flex-start'};
    background: ${p => p.current ? '#91d47b' : 'white'};
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 2px;
`;

export default ChatMessageList;
