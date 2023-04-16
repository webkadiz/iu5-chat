import {
    ChangeEvent,
    ChangeEventHandler,
    ForwardedRef,
    forwardRef,
    KeyboardEventHandler,
    MutableRefObject,
    RefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import MicIcon from '@mui/icons-material/Mic';

import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';

import { MessageService } from '../../api/generated/services/MessageService';
import { ActiveChatContext } from '../../context/active-chat';
import { useCurrentUser } from '../../state/current-user/slice';
import CollapseAnim from '../common/CollapseAnim';

import { Remarkable } from 'remarkable';
import MessageAttachFile from '../message/MessageAttachFile';

type Props = {
    onSend: () => void;
    messageInputRef: RefObject<HTMLTextAreaElement>;
};

const BASE_HEIGHT = 15;

const ChatMessageInput = ({ onSend, messageInputRef }: Props) => {
    const { activeChat } = useContext(ActiveChatContext);
    const currentUser = useCurrentUser();
    const [messageValue, setMessageValue] = useState('');
    const [md, setMd] = useState<Remarkable | null>(null);
    const [height, setHeight] = useState(BASE_HEIGHT);
    const qc = useQueryClient();

    useEffect(() => {
        setMd(
            new Remarkable({
                typographer: false,
                breaks: true,
            })
        );
    }, []);

    const changeMessageValue: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        console.log(e.target.clientHeight);
        console.log(e.target.scrollHeight);
        setHeight(e.target.scrollHeight - 10);
        setMessageValue(e.target.value);
    };

    const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!md) return;
        if (!messageValue.trim() || !activeChat) return;

        setMessageValue('');
        setHeight(BASE_HEIGHT);

        onSend();

        try {
            await MessageService.addMessageInChat(activeChat.id, {
                content: md.render(messageValue),
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
            <MessageAttachFile />
            <MessageInput
                ref={messageInputRef}
                placeholder="Write a message..."
                onInput={changeMessageValue}
                onKeyDown={handleKeyPress}
                value={messageValue}
                $height={height}
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
    height: 24px;
    flex-shrink: 0;
    position: relative;
`;

const Container = styled.div`
    display: flex;
    align-items: flex-end;
    padding: 10px;
    background: white;
    overflow: hidden;
`;

const MessageInput = styled.textarea<{ $height: number }>`
    width: 100%;
    height: ${(p) => p.$height}px;
    padding: 5px;
    border: none;
    outline: none;
    text-align: left;
    resize: none;
`;

const StyledSendIcon = styled(SendIcon)`
    cursor: pointer;
    color: blue;
`;

const StyledMicIcon = styled(MicIcon)`
    cursor: pointer;
`;

export default ChatMessageInput;
