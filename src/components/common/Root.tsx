import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';

import { useAppDispatch } from '../../hooks';
import {
  setUserCurrentAction,
  useCurrentUser,
} from '../../state/current-user/slice';
import ChatNav from '../chat/ChatNav';
import ChatSpace from '../chat/ChatSpace';
import AppDrawer from './AppDrawer';
import ContactsModal from '../modal/ContactsModal';
import CreateContactModal from '../modal/CreateContactModal';
import CreateChatModal from '../modal/CreateChatModal';
import SettingsModal from '../modal/SettingsModal';
import Auth from './Auth';
import { getCurrentUser } from '../../back';

const Root = () => {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => dispatch(setUserCurrentAction(user)))
      .catch(console.log)
      .then(() => setIsInit(true));
  }, []);

  if (!isInit) return null;

  return currentUser ? (
    <StyledRoot>
      <AppDrawer open={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <ContactsModal />
      <CreateContactModal setDrawerOpen={setDrawerOpen} />
      <CreateChatModal setDrawerOpen={setDrawerOpen} />
      <SettingsModal />
      <ChatNav setDrawerOpen={setDrawerOpen} />
      <ChatSpace />
    </StyledRoot>
  ) : (
    <Auth />
  );
};

const StyledRoot = styled.div`
  display: flex;
  text-align: center;
  height: 100%;
`;

export default Root;
