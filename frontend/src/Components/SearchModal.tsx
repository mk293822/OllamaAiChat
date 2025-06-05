import { Edit, X } from "feather-icons-react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import Chats from "./Chats";
import type { GroupedConversation } from "../types";

const SearchModal = ({
  conversations,
    conversation_id,
    show,
  setShowSearchModal,
}: {
  conversations: GroupedConversation | undefined;
        conversation_id: string | null;
        show: boolean;
        setShowSearchModal: () => void
}) => {
  return (
    <Modal show={show}>
      <div className="flex flex-col min-h-64">
        <div className="p-4 relative">
          <input
            type="search"
            className="focus:border-none w-full focus:outline-none text-sm pr-8"
            placeholder="Search Chats..."
          />
          <button onClick={setShowSearchModal}>
            <X className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-600 w-8 h-8" />
          </button>
        </div>
        <hr />
        <div className="p-2">
          <Link
            to={"/"}
            className="flex gap-2 mt-1 cursor-pointer p-2 rounded-xl text-sm hover:bg-gray-600"
          >
            <Edit className="w-4 h-4 mt-0.5" />
            <p>New Chat</p>
          </Link>
          <Chats
            conversations={conversations}
            conversation_id={conversation_id}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
