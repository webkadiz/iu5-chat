import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  TextField,
} from '@mui/material';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteChat, deleteContact, getContacts } from '../../back';
import users from '../../mocks/users';
import Queries from '../../queries';
import {
  setIsContactsModalAction,
  setIsCreateContactModalAction,
  useIsContactsModal,
} from '../../state/modal';
import { Contact } from '../../types';
import { filterBy } from '../../utils';
import FetchWrapper from '../common/FetchWrapper';
import UserInfoItem from '../common/UserInfoItem';

const ContactsModal: React.FC = () => {
  const dispatch = useDispatch();
  const isContactsModalOpen = useIsContactsModal();
  const [search, setSearch] = useState('');

  const qc = useQueryClient();

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    setSearch(value);
  };

  const fetchFn = async () => {
    const contacts = await getContacts();

    return contacts;
  };

  const deleteContactHandler = async (contact: Contact) => {
    console.log(contact);
    try {
      await deleteContact(contact.userId);

      qc.invalidateQueries(Queries.contact.getContacts);

      toast.success('Контакт удален');
    } catch (e) {
      toast.error('Не удалось удалить контакт');
    }
  };

  return (
    <StyledDialog
      open={isContactsModalOpen}
      onClose={() => dispatch(setIsContactsModalAction(false))}
    >
      <FetchWrapper
        queryKey={Queries.contact.getContacts}
        fetchFn={fetchFn}
        render={({ data }) => {
          const searchContacts = data.filter(filterBy(search, 'username'));

          return (
            <>
              <DialogTitle className="dialog-title">Контакты</DialogTitle>
              <DialogContent className="dialog-content">
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Поиск"
                  className="dialog-search"
                  value={search}
                  onChange={onSearch}
                />
                <List>
                  {searchContacts.map((contact) => (
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => deleteContactHandler(contact)}
                        >
                          <CloseOutlined />
                        </IconButton>
                      }
                    >
                      <ListItemButton>
                        <UserInfoItem user={contact} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    dispatch(setIsContactsModalAction(false));
                    dispatch(setIsCreateContactModalAction(true));
                  }}
                >
                  Добавить контакт
                </Button>
                <Button
                  onClick={() => dispatch(setIsContactsModalAction(false))}
                >
                  Закрыть
                </Button>
              </DialogActions>
            </>
          );
        }}
      />
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  .dialog-title {
    padding-left: 16px;
    padding-right: 16px;
  }

  .dialog-content {
    width: 300px;
    height: 400px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
  }

  .dialog-search {
    padding-left: 16px;
    padding-right: 16px;
    box-sizing: border-box;
  }
`;

export default ContactsModal;
