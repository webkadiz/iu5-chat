import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import heart from '../../assets/images/heart.svg';
import thumbup from '../../assets/images/thumbup.svg';
import fire from '../../assets/images/fire.svg';
import confused from '../../assets/images/confused.png';
import cry from '../../assets/images/cry.png';
import smile from '../../assets/images/smile.png';
import smileLove from '../../assets/images/smile-love.png';
import inLove from '../../assets/images/in-love.png';
import thinking from '../../assets/images/thinking.png';
import sad from '../../assets/images/sad.png';
import laughing from '../../assets/images/laughing.png';
import party from '../../assets/images/party.png';
import cool from '../../assets/images/cool.png';
import { ExpandCircleDownRounded } from '@mui/icons-material';
import { Message } from '../../types';
import { createReaction } from '../../back';
import { useQueryClient } from 'react-query';
import Queries from '../../queries';
import { ActiveChatContext } from '../../context/active-chat';

type Props = {
  message: Message | null;
};

export const emojiSet = [
  { name: 'heart', src: heart },
  { name: 'thumbup', src: thumbup },
  { name: 'fire', src: fire },
  { name: 'confused', src: confused },
  { name: 'cry', src: cry },
  { name: 'smile', src: smile },
  { name: 'smileLove', src: smileLove },
  { name: 'inLove', src: inLove },
  { name: 'thinking', src: thinking },
  { name: 'sad', src: sad },
  { name: 'laughing', src: laughing },
  { name: 'party', src: party },
  { name: 'cool', src: cool },
];

const EmojiList: React.FC<Props> = ({ message }) => {
  const [isExpand, setIsExpand] = useState(false);
  const { activeChat } = useContext(ActiveChatContext);
  const qc = useQueryClient();

  const expandEmoji = () => {
    setIsExpand(true);
  };

  const addReaction = async (name: string) => {
    if (!message || !activeChat) return;

    try {
      await createReaction({
        messId: message.id,
        userId: message.userFrom.id,
        reactionName: name,
      });

      qc.invalidateQueries(Queries.chat.getMessages(activeChat.id));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledEmojiList isExpand={isExpand}>
      {emojiSet.slice(0, isExpand ? emojiSet.length : 3).map((emoji, i) => (
        <EmojiItem key={i} onClick={() => addReaction(emoji.name)}>
          <img src={emoji.src} />
        </EmojiItem>
      ))}
      {!isExpand && <StyledExpand color="disabled" onClick={expandEmoji} />}
    </StyledEmojiList>
  );
};

const StyledEmojiList = styled.div<{ isExpand: boolean }>`
  display: flex;
  flex-wrap: ${(p) => (p.isExpand ? 'wrap' : 'nowrap')};
  width: ${(p) => (p.isExpand ? '250px' : '150px')};
  align-items: center;
  padding: 5px 16px;
  padding-bottom: 0px;
  transition: 0.3s;
`;

const EmojiItem = styled.div`
  cursor: pointer;
  flex-shrink: 0;
  padding: 8px;
  border-radius: 50%;
  transition: 0.3s;
  width: 24px;
  height: 24px;

  &:hover {
    background: #eee;
  }

  img {
    width: 100%;
  }
`;

const StyledExpand = styled(ExpandCircleDownRounded)`
  cursor: pointer;
  margin-left: 4px;

  &:hover {
    fill: black;
  }
`;

export default EmojiList;
