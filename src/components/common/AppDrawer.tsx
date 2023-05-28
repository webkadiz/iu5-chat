import styled from '@emotion/styled';
import {
  Contacts,
  GroupAdd,
  LogoutOutlined,
  QuestionAnswer,
  Settings,
} from '@mui/icons-material';
import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../../back';
import {
  setUserCurrentAction,
  useCurrentUser,
} from '../../state/current-user/slice';
import {
  setIsContactsModalAction,
  setIsCreateChatModalAction,
  setIsCreateContactModalAction,
  setIsSettingsModalAction,
} from '../../state/modal';
import Div from '../styled/Div';

type Props = {
  open: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const AppDrawer: React.FC<Props> = ({ open, setDrawerOpen }) => {
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await logoutUser();

      toast.success('Выход выполнен');
      setDrawerOpen(false);
      dispatch(setUserCurrentAction(null));
    } catch (e) {
      toast.error('Не удалось выйти');
    }
  };

  if (!currentUser) return null;

  return (
    <Drawer open={open} anchor="left" onClose={() => setDrawerOpen(false)}>
      <UserInfo>
        <Avatar className="avatar" src={currentUser.avatar}>
          {currentUser.username[0].toUpperCase()}
        </Avatar>
        <Div className="username">{currentUser.username}</Div>
      </UserInfo>
      <StyledList>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => dispatch(setIsContactsModalAction(true))}
          >
            <ListItemIcon className="list-icon">
              <Contacts color="success" />
            </ListItemIcon>
            Контакты
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => dispatch(setIsCreateContactModalAction(true))}
          >
            <ListItemIcon className="list-icon">
              <GroupAdd color="primary" />
            </ListItemIcon>
            Добавить контакт
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => dispatch(setIsCreateChatModalAction(true))}
          >
            <ListItemIcon className="list-icon">
              <QuestionAnswer color="error" />
            </ListItemIcon>
            Добавить чат
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => dispatch(setIsSettingsModalAction(true))}
          >
            <ListItemIcon className="list-icon">
              <Settings color="warning" />
            </ListItemIcon>
            Настройки
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => logoutHandler()}>
            <ListItemIcon className="list-icon">
              <LogoutOutlined color="info" />
            </ListItemIcon>
            Выйти
          </ListItemButton>
        </ListItem>
      </StyledList>
    </Drawer>
  );
};

const StyledList = styled(List)`
  .list-icon {
    min-width: 35px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;

  .avatar {
    margin-right: 10px;
  }

  .username {
    flex: 1;
    font-weight: 500;
  }
`;

export default AppDrawer;
