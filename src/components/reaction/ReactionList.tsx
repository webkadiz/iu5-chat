import styled from '@emotion/styled';
import { find } from 'lodash';
import { Reaction } from '../../types';
import { emojiSet } from '../emoji/EmojiList';

type Props = {
  reactions: Reaction[];
};

const ReactionList: React.FC<Props> = ({ reactions }) => {
  return (
    <Container>
      {reactions.map((reaction) => {
        const emoji = find(emojiSet, { name: reaction.reaction });

        if (!emoji) return;

        return (
          <EmojiContainer many={reaction.quantity > 1} key={reaction.reaction}>
            <EmojiIcon src={emoji.src} />
            {reaction.quantity > 1 && (
              <EmojiCount>{reaction.quantity}</EmojiCount>
            )}
          </EmojiContainer>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const EmojiIcon = styled.img`
  width: 16px;
`;

const EmojiContainer = styled.div<{ many: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 5px;

  ${(p) =>
    p.many &&
    `
      padding: 5px; 5px;
      background: ${p.theme.colors.brand};
      border-radius: 16px;
  `}
`;

const EmojiCount = styled.span`
  margin-left: 2px;
  color: white;
`;

export default ReactionList;
