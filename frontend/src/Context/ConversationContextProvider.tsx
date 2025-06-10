import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";
import useAuth from "../Hooks/useAuth";
import useError from "../Hooks/useError";
import api from "../api";
import axios from "axios";
import { ConversationContext } from "./Contexts";
import type { Conversation, GroupedConversation } from "../types";
import useConversationActions from "../Hooks/useConversationActions";

const ConversationContextProvider = ({ children }: PropsWithChildren) => {
	const { token } = useAuth();
	const { setErrorMessage } = useError();
	const [conversations, setConversations] = useState<GroupedConversation>();
	const [archivedConversations, setArchivedConversations] = useState<GroupedConversation>();
	const { filterConversation, addConversation, addArchivedConversation, filterArchivedConversation } = useConversationActions();

	// Archive the conversation
	const handleArchive = useCallback(
		async (conversation: Conversation | null) => {
			if (!conversation) return;
			try {
				const response = await api.post(`/api/archiveConversation/${conversation.id ?? null}`);

				const response_conversation: Conversation = response.data.conversation;

				if (response_conversation?.archived) {
					filterConversation(response_conversation);
					addArchivedConversation(response_conversation);
				} else {
					addConversation(response_conversation);
					filterArchivedConversation(response_conversation);
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if(!token) setErrorMessage(error.response ? error.response.statusText : null);
				} else {
					console.log(error);
				}
			}
		},
		[setErrorMessage, token, filterConversation, addArchivedConversation, addConversation, filterArchivedConversation]
	);

	// Get the conversations
	useEffect(() => {
		const controller = new AbortController();
		const getConversations = async () => {
			try {
				const response = await api.get(`/api/getConversations`, {
					signal: controller.signal,
				});

				setConversations(response.data.conversations);
				setArchivedConversations(response.data.archivedConversations);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setErrorMessage(error.response ? error.response.statusText : null);
				} else {
					console.log(error);
				}
			}
		};
		if (token) getConversations();

		return () => controller.abort();
	}, [setErrorMessage, token]);

	// Delete the conversation
	const handleDeleteConversation = useCallback(
		async (conversation: Conversation | null) => {
			if (!conversation) return;
			try {
				if (token && conversation) {
					await api.delete(`/api/destory/${conversation.id}`);
					filterConversation(conversation);
					filterArchivedConversation(conversation);
				} else {
					setErrorMessage(`Conversation ${conversation.title} deletion error`);
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setErrorMessage("Conversation deletion failed: " + error.message);
				} else {
					console.log("Unknown error:", error);
				}
			}
		},
		[token, setErrorMessage, filterConversation, filterArchivedConversation]
	);

	const contextValue = useMemo(
		() => ({
			handleDeleteConversation,
			conversations,
			setConversations,
			handleArchive,
			archivedConversations,
			setArchivedConversations
		}),
		[handleDeleteConversation, conversations, handleArchive, archivedConversations]
	);

	return (
		<ConversationContext.Provider value={contextValue}>
			{children}
		</ConversationContext.Provider>
	);
};

export default ConversationContextProvider;
