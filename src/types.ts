import { AttachmentFile } from "./components/message/MessageAttachFile";

export type User = {
  id: number;
  username: string;
  phone: string;
  bio: string;
  avatar: string;
};

export type UserShort = {
  username: string;
  phone: string;
  avatar: string;
};

export type Contact = {
  contactId: number;
  userId: number;
  avatar: string;
  username: string;
  phone: string;
};

export type Chat = {
  id: number;
  name: string;
  avatar: string;
  description: string;
  users: number[];
};

export type Message = {
  id: number;
  content: string;
  userFrom: User;
  attachment: string[];
  photos: string[];
  audio: string;
  timeCreated: string;
  reactions: Reaction[];
  shown: boolean;
};

export type Reaction = {
  reaction: string;
  quantity: number;
};
