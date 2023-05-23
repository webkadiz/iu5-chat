import { configureStore } from '@reduxjs/toolkit';

import currentUser from './current-user/slice';
import modal from './modal';

const store = configureStore({
    reducer: { currentUser, modal },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
