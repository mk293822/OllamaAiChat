import { createContext } from "react";
import type {
	AuthContextType,
	AuthUserContextType,
	ConversationContextType,
	ErrorContextType,
} from "../types/context";

export const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	setUser: () => {},
	setToken: () => {},
});

export const AuthenticatedUserContext = createContext<AuthUserContextType>({
	isOpenedSideBar: true,
	setIsOpenedSideBar: () => {},
	showSearchModal: false,
	setShowSearchModal: () => {},
	conversationId: null,
	setConversationId: () => {},
});

export const ErrorContext = createContext<ErrorContextType>({
	errorMessage: null,
	setErrorMessage: () => {},
});

export const ConversationContext = createContext<ConversationContextType>({
	handleDeleteConversation: () => {},
	conversations: undefined,
	handleArchive: () => {},
	setConversations: () => {},
	archivedConversations: undefined,
	setArchivedConversations: () => {},
});
