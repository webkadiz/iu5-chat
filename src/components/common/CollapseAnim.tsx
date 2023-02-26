import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
    isVisible: boolean;
    children: React.ReactNode;
};

const CollapseAnim = ({ isVisible, children }: Props) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <StyledMotionDiv
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                >
                    {children}
                </StyledMotionDiv>
            )}
        </AnimatePresence>
    );
};

const StyledMotionDiv = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
`;

export default CollapseAnim;
