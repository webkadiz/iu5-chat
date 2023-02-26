import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useContext,
    useRef,
    useState,
} from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';

import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';

import { MessageService } from '../../api/generated/services/MessageService';
import { ActiveChatContext } from '../../context/active-chat';
import { useCurrentUser } from '../../state/current-user/slice';
import CollapseAnim from '../common/CollapseAnim';

type Props = {
    onSend: () => void;
};

const ChatMessageInput = ({ onSend }: Props) => {
    const { activeChat } = useContext(ActiveChatContext);
    const currentUser = useCurrentUser();
    const [messageValue, setMessageValue] = useState('');
    const qc = useQueryClient();
    const messageInputRef = useRef<HTMLSpanElement>(null);

    const changeMessageValue = (e: ChangeEvent) => {
        const target = e.target as HTMLSpanElement;

        setMessageValue(target.innerHTML);
    };

    const handleKeyPress: KeyboardEventHandler<HTMLSpanElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!messageValue.trim() || !activeChat) return;

        if (messageInputRef.current) {
            messageInputRef.current.innerHTML = '';
        }

        setTimeout(() => {
            if (messageInputRef.current) {
                messageInputRef.current.innerHTML = '';
            }
        });

        onSend();

        try {
            await MessageService.addMessageInChat(activeChat.id, {
                content: messageValue.trim(),
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
            <StyledAttachFileIcon />
            <MessageInput
                ref={messageInputRef}
                placeholder="Write a message..."
                value={messageValue}
                // @ts-ignore
                onInput={changeMessageValue}
                onKeyDown={handleKeyPress}
                contentEditable
            ></MessageInput>
            <SendMicIconContainer>
                <CollapseAnim isVisible={!!messageValue}>
                    <StyledSendIcon onClick={sendMessage} />
                </CollapseAnim>
                <CollapseAnim isVisible={!messageValue}>
                    <StyledMicIcon />
                </CollapseAnim>
            </SendMicIconContainer>
        </Container>
    );
};

const SendMicIconContainer = styled.div`
    width: 24px;
    flex-shrink: 0;
    height: 100%;
    position: relative;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
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
`;

const StyledMicIcon = styled(MicIcon)`
    cursor: pointer;
`;

const StyledAttachFileIcon = styled(AttachFileIcon)`
    font-size: 1.8rem;
    cursor: pointer;
    margin-right: 8px;
    opacity: 0.5;
`;

export default ChatMessageInput;
