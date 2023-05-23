import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import { Message } from '../../types';

type Props = {
  message: Message;
  onClose: () => void;
};

const MessageReplyPreview = ({ message, onClose }: Props) => {
  return (
    <Container>
      <StyledReplyIcon />
      <div>
        <UsernameReply>{message.userFrom.username}</UsernameReply>
        <MessageReplyText>{message.content}</MessageReplyText>
      </div>
      <StyledCloseIcon onClick={onClose} />
    </Container>
  );
};

const UsernameReply = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #33b8b8;
  text-align: left;
`;

const MessageReplyText = styled.div`
  font-size: 14px;
  margin-top: 2px;
`;

const Container = styled.div`
  align-items: center;
  padding: 10px;
  background: white;
  display: flex;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  opacity: 0.5;
  font-size: 1.4rem;
  margin-left: auto;
  margin-right: 5px;
  transition: 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledReplyIcon = styled(ReplyIcon)`
  font-size: 2rem;
  color: #33b8b8;
  margin-right: 10px;
`;

export default MessageReplyPreview;
