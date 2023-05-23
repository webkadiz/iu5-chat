import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { ActiveChatContext } from '../../context/active-chat';
import Span from '../styled/Span';

type Props = {
  onDelete: () => void;
};

const TopToolbar: React.FC<Props> = ({ onDelete }) => {
  const { activeChat } = useContext(ActiveChatContext);

  return (
    <Container>
      <Span medium>{activeChat?.name}</Span>
      <Button color={'error'} onClick={onDelete}>
        Удалить
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 20px;
`;

export default TopToolbar;
