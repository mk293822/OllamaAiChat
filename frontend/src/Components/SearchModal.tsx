import { Edit, X } from "feather-icons-react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import Chats from "./Chats";
import type { GroupedConversation } from "../types";
import type React from "react";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";

const SearchModal = ({
  groupedConversations,
  conversation_id,
  show,
  setShowSearchModal,
}: {
  groupedConversations: GroupedConversation | undefined;
  conversation_id: string | null;
  show: boolean;
  setShowSearchModal: () => void;
}) => {
  const [query, setQuery] = useState<string>("");

  const filteredConversations = useMemo(() => {
    if (query === "" || !query) return groupedConversations;
    const filtered: GroupedConversation = {};

    for (const group in groupedConversations) {
      const groupKey = group as keyof GroupedConversation;
      const conversations = groupedConversations[groupKey];

      if (conversations && conversations.length > 0) {
        const fuse = new Fuse(conversations, {
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
  }, [groupedConversations, query]);

  return (
    <Modal show={show} onClose={setShowSearchModal}>
      <div className="flex flex-col min-h-80 text-gray-200">
        <div className="p-4 relative flex items-center justify-between">
          <input
            value={query}
            type="search"
            className="focus:border-none w-full focus:outline-none text-sm pr-8"
            placeholder="Search Chats..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={setShowSearchModal}>
            <X className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-600 w-6 h-6" />
          </button>
        </div>
        <hr />
        <div className="p-2">
          <Link
            to={"/"}
            onClick={setShowSearchModal}
            className="flex gap-2 mt-1 cursor-pointer p-2 rounded-xl text-sm hover:bg-gray-600"
          >
            <Edit className="w-4 h-4 mt-0.5" />
            <p>New Chat</p>
          </Link>
          <Chats
            setShowSearchModal={setShowSearchModal}
            conversations={filteredConversations}
            conversation_id={conversation_id}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
