import axios from 'axios';
import { Chat, Contact, Message, User } from './types';

axios.defaults.baseURL = 'http://localhost:8080';

type UserRegisterDto = {
  username: string;
  phone: string;
  password: string;
  bio: string;
  avatar: string;
};

export const registerUser = (data: UserRegisterDto) => {
  return axios.post('/api/register', data);
};

type UserLoginDto = Pick<UserRegisterDto, 'phone' | 'password'>;

export const loginUser = (data: UserLoginDto) => {
  return axios.post('/api/login', data);
};

export const logoutUser = () => {
  return axios.post('/iuchat/logout');
};

export const getCurrentUser = (): Promise<User> => {
  return axios.get('/iuchat/user').then((res) => {
    const user = res.data.body;

    return {
      id: user.id,
      username: user.username,
      phone: user.phoneNumber,
      avatar: user.avatar,
      bio: user.bio,
    };
  });
};

export const getContacts = (): Promise<Contact[]> => {
  return axios.get('/iuchat/contacts').then((res) => res.data.body.contacts);
};

export const createContact = (phone: string): Promise<Contact[]> => {
  return axios.post(`/iuchat/contacts/${phone}`);
};

export const deleteContact = (contactId: number): Promise<void> => {
  return axios.delete(`/iuchat/contacts/${contactId}`);
};

type CreateChatDto = Omit<Chat, 'id'>;

export const createChat = (data: CreateChatDto): Promise<Contact[]> => {
  return axios.post('/iuchat/chat', data);
};

export const getChats = (): Promise<Chat[]> => {
  return axios.get('/iuchat/chats').then((res) => res.data.body.chats);
};

export const deleteChat = (chatId: number): Promise<void> => {
  return axios.delete(`/iuchat/chat/${chatId}`);
};

export const getMessages = (chatId: number): Promise<Message[]> => {
  return axios
    .get(`/iuchat/message/${chatId}`)
    .then((res) => res.data.body.messages);
};

export type CreateMessageDto = Pick<
  Message,
  'content' | 'attachment' | 'photos' | 'audio'
> & {
  chatId: number;
};

export const createMessage = (data: CreateMessageDto): Promise<void> => {
  return axios.post('/iuchat/message', data);
};

type CreateReactionDto = {
  messId: number;
  reactionName: string;
  userId: number;
};

export const createReaction = (data: CreateReactionDto): Promise<void> => {
  return axios.post('/iuchat/reaction', data);
};
