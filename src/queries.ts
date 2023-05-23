const Queries = {
  chat: {
    getChats: 'getChats',
    getMessages: (chatId: number) => `getMessages|${chatId}`,
  },
  contact: {
    getContacts: 'getContacts',
  },
};

export default Queries;
