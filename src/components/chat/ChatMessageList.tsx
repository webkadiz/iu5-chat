import React from 'react';
import styled from '@emotion/styled';

import { Message } from '../../api/generated/models/Message';
import { User } from '../../api/generated/models/User';
import { useCurrentUser } from '../../state/current-user/slice';
import {
    List,
    ListItem,
    ListItemButton,
    Popover,
    PopoverOrigin,
} from '@mui/material';
import { useState } from 'react';
import { KeyboardEventHandler } from 'react';
import { MouseEventHandler } from 'react';

type Props = {
    messages: Message[];
};

const ChatMessageList = ({ messages }: Props) => {
    const currentUser = useCurrentUser();
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

    return (
        <StyledChatMessageList>
            {messageGroups.map((messages) => (
                <MessageGroup>
                    {messages.map((message) => (
                        <StyledMessage
                            key={message.id}
                            current={isCurrentUserMessage(currentUser, message)}
                            onContextMenu={(e) =>
                                handleOpenContextMenu(e, message)
                            }
                        >
                            {message.content}
                        </StyledMessage>
                    ))}
                </MessageGroup>
            ))}
            <Popover
                open={openContextMenu}
                anchorEl={anchorEl}
                onClose={() => setOpenContextMenu(false)}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            >
                <List>
                    <ListItemButton>Ответ</ListItemButton>
                    <ListItemButton>Изменить</ListItemButton>
                    <ListItemButton>Переслать</ListItemButton>
                    <ListItemButton>Копировать</ListItemButton>
                    <ListItemButton>Удалить</ListItemButton>
                </List>
            </Popover>
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

const MessageGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const StyledMessage = styled.div<{ current: boolean }>`
    align-self: ${(p) => (p.current ? 'flex-end' : 'flex-start')};
    background: ${(p) => (p.current ? '#91d47b' : 'white')};
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 2px;
`;

export default ChatMessageList;
