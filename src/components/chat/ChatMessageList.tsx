import React, { ForwardedRef, forwardRef, MutableRefObject } from 'react';
import styled from '@emotion/styled';

import { Message } from '../../api/generated/models/Message';
import { User } from '../../api/generated/models/User';
import { useCurrentUser } from '../../state/current-user/slice';
import { List, ListItemButton, Popover, PopoverOrigin } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';

type Props = {
    messages: Message[];
    onReply: (message: Message) => void;
};

const ChatMessageList = forwardRef(
    ({ messages, onReply }: Props, ref: ForwardedRef<HTMLDivElement>) => {
        const currentUser = useCurrentUser();
        const [activeMessage, setActiveMessage] = useState<Message | null>(
            null
        );
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
        };

        const handleMessageReply = () => {
            if (!activeMessage) return;

            onReply(activeMessage);
        };

        return (
            <StyledChatMessageList ref={ref}>
                {messageGroups.map((messages) => (
                    <MessageGroupContainer
                        current={isCurrentUserMessage(currentUser, messages[0])}
                    >
                        {!isCurrentUserMessage(currentUser, messages[0]) && (
                            <MessageAvatar src={messages[0].from.avatar} />
                        )}
                        <MessageGroup>
                            {messages.map((message) => (
                                <MessageBox
                                    key={message.id}
                                    onContextMenu={(e) =>
                                        handleOpenContextMenu(e, message)
                                    }
                                    current={isCurrentUserMessage(
                                        currentUser,
                                        messages[0]
                                    )}
                                >
                                    <MessageContent
                                        dangerouslySetInnerHTML={{
                                            __html: message.content,
                                        }}
                                    ></MessageContent>
                                    <MessageTime>
                                        {moment(message.createdAt).format(
                                            'hh:mm'
                                        )}
                                    </MessageTime>
                                </MessageBox>
                            ))}
                        </MessageGroup>
                        {isCurrentUserMessage(currentUser, messages[0]) && (
                            <MessageAvatar src={messages[0].from.avatar} />
                        )}
                    </MessageGroupContainer>
                ))}
                <Popover
                    open={openContextMenu}
                    anchorEl={anchorEl}
                    onClose={() => setOpenContextMenu(false)}
                    anchorOrigin={anchorOrigin}
                    transformOrigin={transformOrigin}
                >
                    <List>
                        <ListItemButton onClick={handleMessageReply}>
                            Ответить
                        </ListItemButton>
                        <ListItemButton>Изменить</ListItemButton>
                        <ListItemButton>Переслать</ListItemButton>
                        <ListItemButton>Копировать</ListItemButton>
                        <ListItemButton>Удалить</ListItemButton>
                    </List>
                </Popover>
            </StyledChatMessageList>
        );
    }
);

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
    overflow-y: scroll;
`;

const MessageGroupContainer = styled.div<{ current: boolean }>`
    display: flex;
    align-self: ${(p) => (p.current ? 'flex-end' : 'flex-start')};
    margin-bottom: 10px;
`;

const MessageGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
`;

const MessageBox = styled.div<{ current: boolean }>`
    display: flex;
    background: ${(p) => (p.current ? '#91d47b' : 'white')};
    align-self: ${(p) => (p.current ? 'flex-end' : 'flex-start')};
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 2px;
    text-align: left;
`;

const MessageContent = styled.span`
    text-align: left;
    // min-width: 150px;
`;

// const BottomBar = styled.div`
//     text-align: right;
// `;

const MessageTime = styled.span`
    align-self: flex-end;
    font-size: 12px;
    margin-left: 10px;
    margin-bottom: -2px;
`;

const MessageAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: auto;
`;

export default ChatMessageList;
