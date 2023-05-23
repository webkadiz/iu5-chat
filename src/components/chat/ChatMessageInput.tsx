import {
  ChangeEventHandler,
  KeyboardEventHandler,
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

import { ActiveChatContext } from '../../context/active-chat';
import { useCurrentUser } from '../../state/current-user/slice';
import CollapseAnim from '../common/CollapseAnim';

import { Remarkable } from 'remarkable';
import MessageAttachFile from '../message/MessageAttachFile';
import { TextareaAutosize } from '@mui/material';
import { createMessage } from '../../back';
import Queries from '../../queries';

type Props = {
  onSend: () => void;
  messageInputRef: RefObject<HTMLTextAreaElement>;
};

const ChatMessageInput = ({ onSend, messageInputRef }: Props) => {
  const { activeChat } = useContext(ActiveChatContext);
  const currentUser = useCurrentUser();
  const [messageValue, setMessageValue] = useState('');
  const [md, setMd] = useState<Remarkable | null>(null);
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

    onSend();

    try {
      await createMessage({
        chatId: activeChat.id,
        content: messageValue.trim(),
        photos: [],
        attachment: [],
        audio: '',
      });

      qc.invalidateQueries(Queries.chat.getMessages(activeChat.id));
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  return (
    <Container>
      <MessageAttachFile />
      <MessageInput
        ref={messageInputRef}
        placeholder="Пишите сообщеньку..."
        onInput={changeMessageValue}
        onKeyDown={handleKeyPress}
        value={messageValue}
      />
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

const MessageInput = styled(TextareaAutosize)`
  width: 100%;
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
