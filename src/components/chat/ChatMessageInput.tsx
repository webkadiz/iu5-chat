import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useContext,
    useRef,
    useState,
} from 'react';

import { fadeInRight } from 'react-animations';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';

import { MessageService } from '../../api/generated/services/MessageService';
import { ActiveChatContext } from '../../context/active-chat';
import { useCurrentUser } from '../../state/current-user/slice';

const ChatMessageInput = () => {
    const { activeChat } = useContext(ActiveChatContext);
    const currentUser = useCurrentUser();
    const [messageValue, setMessageValue] = useState('');
    const qc = useQueryClient();
    const messageInputRef = useRef<HTMLSpanElement>(null);

    const changeMessageValue = (e: ChangeEvent) => {
        const target = e.target as HTMLSpanElement;

        setMessageValue(target.innerText);
    };

    const handleKeyPress: KeyboardEventHandler<HTMLSpanElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (messageInputRef.current) {
                messageInputRef.current.innerHTML = '';
            }

            setTimeout(() => {
                if (messageInputRef.current) {
                    messageInputRef.current.innerHTML = '';
                }
            });

            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!messageValue.trim() || !activeChat) return;

        try {
            await MessageService.addMessageInChat(activeChat.id, {
                content: messageValue,
                fromId: currentUser.id,
                toId: activeChat.id,
            });

            qc.invalidateQueries(activeChat.id.toString());
        } catch (err) {
            toast.error(`${err}`);
        }
    };

    return (
        <Container>
            <MessageInput
                ref={messageInputRef}
                placeholder="Write a message..."
                value={messageValue}
                // @ts-ignore
                onInput={changeMessageValue}
                onKeyDown={handleKeyPress}
                contentEditable
            ></MessageInput>
            {messageValue && <StyledSendIcon onClick={sendMessage} />}
        </Container>
    );
};

const fadeInRightAnimation = keyframes`${fadeInRight}`;

const Container = styled.div`
    display: flex;
    padding: 10px;
    background: white;
    overflow: hidden;
`;

const MessageInput = styled.span`
    width: 100%;
    padding: 5px;
    border: none;
    outline: none;
    text-align: left;
`;

const StyledSendIcon = styled(SendIcon)`
    cursor: pointer;
    color: blue;
    animation: 0.3s ${fadeInRightAnimation};
`;

export default ChatMessageInput;
