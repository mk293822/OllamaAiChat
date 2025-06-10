import useConversation from "./useConversation";
import type { Conversation, GroupedConversation } from "../types";

const useConversationActions = () => {

    const { conversations, setConversations, archivedConversations, setArchivedConversations } = useConversation();
    
	const filterConversation = 
		(conversation: Conversation) => {
			if (conversations) {
				setConversations((pre) => {
					const updated = { ...pre };

					for (const group in updated) {
						const key = group as keyof GroupedConversation;
						updated[key] = updated[key]?.filter(
							(con) => con.id !== conversation.id
						);
					}

					return updated;
				});
			}
		};

	const filterArchivedConversation = 
		(conversation: Conversation) => {
			if (archivedConversations) {
				setArchivedConversations((pre) => {
					const updated = { ...pre };

					for (const group in updated) {
						const key = group as keyof GroupedConversation;
						updated[key] = updated[key]?.filter(
							(con) => con.id !== conversation.id
						);
					}

					return updated;
				});
			}
		};

	const addConversation =
		(conversation: Conversation) => {
			if (conversations) {
				setConversations((pre) => {
					const updated = { ...pre };

					updated["Today"] ??= [];

					updated["Today"] = [conversation, ...updated["Today"]];
					return updated;
				});
			}
		};
	
	const addArchivedConversation =
		(conversation: Conversation) => {
			if (archivedConversations) {
				setArchivedConversations((pre) => {
					const updated = { ...pre };

					updated["Today"] ??= [];

					updated["Today"] = [conversation, ...updated["Today"]];
					return updated;
				});
			}
		};
    
    const getConversation = (id: string | null) => {
			if (!id) return null;

			for (const group in conversations) {
				const key = group as keyof GroupedConversation;
				const grouped = conversations[key];
				if (grouped) {
					const found = grouped.find((con) => con.id === id);
					if (found) return found;
				}
			}

			return null;
		};


    return {
        filterConversation, 
        addConversation,
		getConversation,
		filterArchivedConversation,
		addArchivedConversation
  }
}

export default useConversationActions
