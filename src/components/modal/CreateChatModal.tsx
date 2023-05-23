import styled from '@emotion/styled';
import { find } from 'lodash';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  TextField,
} from '@mui/material';
import { SetStateAction } from 'react';
import { ChangeEventHandler, Dispatch, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createChat, getChats, getContacts } from '../../back';
import Queries from '../../queries';
import {
  setIsCreateChatModalAction,
  useIsCreateChatModal,
} from '../../state/modal';
import { filterBy } from '../../utils';
import FetchWrapper from '../common/FetchWrapper';
import UserInfoItem from '../common/UserInfoItem';

type Props = {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateChatModal: React.FC<Props> = ({ setDrawerOpen }) => {
  const dispatch = useDispatch();
  const isCreateChatModalOpen = useIsCreateChatModal();
  const [search, setSearch] = useState('');
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  const qc = useQueryClient();

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    setSearch(value);
  };

  const fetchFn = async () => {
    const contacts = await getContacts();

    return contacts;
  };

  const createChatHandler = async () => {
    try {
      const chats = await getChats();

      const existedChat = find(chats, { name: chatName });

      if (existedChat) {
        toast.error('Чат с таким именем уже существует');

        return;
      }

      await createChat({
        name: chatName,
        users: [...selectedUsers.values()],
        avatar: 'ava',
        description: 'desc',
      });

      toast.success('Чат создан');

      qc.invalidateQueries(Queries.chat.getChats);

      setSearch('');
      setChatName('');
      dispatch(setIsCreateChatModalAction(false));
      setDrawerOpen(false);
    } catch (e) {
      toast.error('Не удалось создать чат');
    }
  };

  return (
    <StyledDialog
      open={isCreateChatModalOpen}
      onClose={() => dispatch(setIsCreateChatModalAction(false))}
    >
      <FetchWrapper
        queryKey="contacts"
        fetchFn={fetchFn}
        render={({ data }) => {
          const searchContacts = data.filter(filterBy(search, 'username'));

          return (
            <>
              <DialogTitle className="dialog-title">Создать чат</DialogTitle>
              <DialogContent className="dialog-content">
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Название"
                  className="dialog-search"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
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
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={selectedUsers.has(contact.userId)}
                        onClick={() => {
                          if (selectedUsers.has(contact.userId)) {
                            selectedUsers.delete(contact.userId);
                          } else {
                            selectedUsers.add(contact.userId);
                          }
                          setSelectedUsers(new Set(selectedUsers));
                        }}
                      >
                        <UserInfoItem user={contact} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => createChatHandler()}>Создать чат</Button>
                <Button
                  onClick={() => dispatch(setIsCreateChatModalAction(false))}
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
    margin-bottom: 10px;
  }
`;

export default CreateChatModal;
