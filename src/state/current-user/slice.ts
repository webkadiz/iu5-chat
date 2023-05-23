import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../../hooks';
import { User } from '../../types';

const currentUser = createSlice({
  name: 'currentUser',
  initialState: null as User | null,
  reducers: {
    setCurrentUser(state, { payload }: PayloadAction<User | null>) {
      return payload;
    },
  },
});

export const useCurrentUser = () =>
  useAppSelector((state) => state.currentUser);

export const { setCurrentUser: setUserCurrentAction } = currentUser.actions;

export default currentUser.reducer;
