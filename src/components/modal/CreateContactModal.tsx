import styled from '@emotion/styled';
import { find } from 'lodash';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { SetStateAction } from 'react';
import { Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createContact, getContacts } from '../../back';
import {
  setIsCreateContactModalAction,
  useIsCreateContactModal,
} from '../../state/modal';

type Props = {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateContactModal: React.FC<Props> = ({ setDrawerOpen }) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const isCreateContactModalOpen = useIsCreateContactModal();

  const createContactHandler = async () => {
    try {
      const contacts = await getContacts();

      const existedContact = find(contacts, { phone });

      if (existedContact) {
        toast.error('Такой контакт уже существует');
        return;
      }

      await createContact(phone);

      setPhone('');
      dispatch(setIsCreateContactModalAction(false));
      setDrawerOpen(false);

      toast.success('Контакт добален');
    } catch (e) {
      toast.error('Не удалось добавить контакт');
    }
  };

  return (
    <Dialog
      open={isCreateContactModalOpen}
      onClose={() => dispatch(setIsCreateContactModalAction(false))}
    >
      <DialogTitle>Добавить контакт</DialogTitle>
      <StyledDialogContent>
        <StyledTextField
          label="Телефон"
          variant="standard"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={createContactHandler}>Добавить</Button>
        <Button
          onClick={() => {
            setPhone('');
            dispatch(setIsCreateContactModalAction(false));
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StyledDialogContent = styled(DialogContent)`
  width: 300px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 12px;
`;

export default CreateContactModal;
