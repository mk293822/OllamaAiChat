import { createContext } from "react";
import type { AuthContextType, UserContextType } from "../types/context";

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  logout: () => {},
  registered: () => {},
});

export const AuthenticatedContext = createContext<AuthContextType>({
  isOpenedSideBar: true,
  setIsOpenedSideBar: () => {},
  error: null,
  handleDeleteConversation: () => {},
  deletedConversationIds: [],
  showSearchModal: false,
  setShowSearchModal: () => {},
});
