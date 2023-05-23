import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
    setIsSettingsModalAction,
    useIsSettingsModal,
} from '../../state/modal';

const SettingsModal: React.FC = () => {
    const dispatch = useDispatch();
    const isSettingsModalOpen = useIsSettingsModal();

    return (
        <Dialog
            open={isSettingsModalOpen}
            onClose={() => dispatch(setIsSettingsModalAction(false))}
        >
            123
        </Dialog>
    );
};

export default SettingsModal;
