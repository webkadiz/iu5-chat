import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isContactsModal: false,
        isCreateContactModal: false,
        isCreateChatModal: false,
        isSettingsModal: false,
    },
    reducers: {
        setIsContactsModal(state, { payload }: PayloadAction<boolean>) {
            state.isContactsModal = payload;
        },
        setIsCreateContactModal(state, { payload }: PayloadAction<boolean>) {
            state.isCreateContactModal = payload;
        },
        setIsCreateChatModal(state, { payload }: PayloadAction<boolean>) {
            state.isCreateChatModal = payload;
        },
        setIsSettingsModal(state, { payload }: PayloadAction<boolean>) {
            state.isSettingsModal = payload;
        },
    },
});

export const useIsContactsModal = () =>
    useSelector((state: RootState) => state.modal.isContactsModal);

export const useIsCreateContactModal = () =>
    useSelector((state: RootState) => state.modal.isCreateContactModal);

export const useIsCreateChatModal = () =>
    useSelector((state: RootState) => state.modal.isCreateChatModal);

export const useIsSettingsModal = () =>
    useSelector((state: RootState) => state.modal.isSettingsModal);

export const {
    setIsContactsModal: setIsContactsModalAction,
    setIsCreateContactModal: setIsCreateContactModalAction,
    setIsCreateChatModal: setIsCreateChatModalAction,
    setIsSettingsModal: setIsSettingsModalAction,
} = modalSlice.actions;

export default modalSlice.reducer;
