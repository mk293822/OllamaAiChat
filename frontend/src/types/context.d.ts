import type { Dispatch, SetStateAction } from "react";
import type { Conversation, GroupedConversation, User } from ".";

export type AuthContextType = {
	user: User | null;
	token: null | string;
	setToken: Dispatch<SetStateAction<string | null>>;
	setUser: Dispatch<SetStateAction<User | null>>;
};

export type AuthUserContextType = {
	isOpenedSideBar: boolean;
	setIsOpenedSideBar: Dispatch<SetStateAction<boolean>>;
	showSearchModal: boolean;
	setShowSearchModal: Dispatch<SetStateAction<boolean>>;
	conversationId: string | null;
	setConversationId: Dispatch<SetStateAction<string | null>>;
};

export type ErrorContextType = {
	errorMessage: string | null;
	setErrorMessage: Dispatch<SetStateAction<string | null>>;
};

export type ConversationContextType = {
	handleDeleteConversation: (conversation: Conversation | null) => void;
	handleArchive: (conversation: Conversation | null) => void;
	conversations: GroupedConversation | undefined;
	archivedConversations: GroupedConversation | undefined;
	setConversations: Dispatch<SetStateAction<GroupedConversation | undefined>>;
	setArchivedConversations: Dispatch<
		SetStateAction<GroupedConversation | undefined>
	>;
};
