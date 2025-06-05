export type User = {
  id: number;
  name: string;
  email: string;
};
export type Conversation = {
  title: string;
  id: string;
  at: string;
};

export type GroupedConversation = {
  Today?: Conversation[];
  Yesterday?: Conversation[];
  "Previous 7 Days"?: Conversation[];
  Older?: Conversation[];
};