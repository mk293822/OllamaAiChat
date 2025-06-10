import { Edit, X } from "feather-icons-react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import Chats from "./Chats";
import type { GroupedConversation } from "../types";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import useConversation from "../Hooks/useConversation";
import useAuthUserContext from "../Hooks/useAuthUserContext";

const SearchModal = () => {
	const [query, setQuery] = useState<string>("");
	const { conversations } = useConversation();
	const { setShowSearchModal, showSearchModal } = useAuthUserContext();

	const filteredConversations = useMemo(() => {
		if (query === "" || !query) return conversations;
		const filtered: GroupedConversation = {};

		for (const group in conversations) {
			const groupKey = group as keyof GroupedConversation;
			const groupedConversation = conversations[groupKey];

			if (groupedConversation && groupedConversation.length > 0) {
				const fuse = new Fuse(groupedConversation, {
					keys: ["title"],
					threshold: 0.5,
				});
				const filteredItems = fuse.search(query).map((result) => result.item);

				if (filteredItems.length > 0) {
					filtered[groupKey] = filteredItems;
				}
			}
		}
		return filtered;
	}, [conversations, query]);

	return (
		<Modal show={showSearchModal} onClose={() => setShowSearchModal(false)}>
			<div className="flex flex-col min-h-80 text-gray-200">
				<div className="p-4 relative flex items-center justify-between">
					<input
						value={query}
						type="search"
						className="focus:border-none w-full focus:outline-none text-sm pr-8"
						placeholder="Search Chats..."
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button onClick={() => setShowSearchModal(false)}>
						<X className="absolute right-3 top-3 p-1 rounded-full hover:cursor-pointer hover:bg-gray-600 w-6 h-6" />
					</button>
				</div>
				<hr />
				<div className="p-2">
					<Link
						to={"/"}
						onClick={() => setShowSearchModal(false)}
						className="flex gap-2 mt-1 cursor-pointer p-2 rounded-xl text-sm hover:bg-gray-600"
					>
						<Edit className="w-4 h-4 mt-0.5" />
						<p>New Chat</p>
					</Link>
					<Chats conversations={filteredConversations} />
				</div>
			</div>
		</Modal>
	);
};

export default SearchModal;
