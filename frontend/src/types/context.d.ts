import type { Dispatch, SetStateAction } from "react";
import type { User } from ".";

export type UserContextType = {
  user: User | null;
  token: null | string;
  logout: () => void;
  registered: () => void;
};

export type AuthContextType = {
  isOpenedSideBar: boolean;
  setIsOpenedSideBar: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  handleDeleteConversation: (conversationId: string | null) => void;
  deletedConversationIds: (string | undefined)[];
  showSearchModal: boolean;
  setShowSearchModal: Dispatch<SetStateAction<boolean>>;
};