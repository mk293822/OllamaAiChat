import { Edit, Search, Sidebar } from "feather-icons-react";
import Chats from "./Chats";
import "../index.css";
import { Link } from "react-router-dom";
import type { GroupedConversation } from "../types";
import { useContext } from "react";
import { AuthenticatedContext } from "../Context/Contexts";
import SearchModal from "./SearchModal";

const SideBar = ({
  conversations,
  conversation_id,
  handleArchive,
}: {
  conversations: GroupedConversation | undefined;
  conversation_id: string | null;
  handleArchive: (id: string | null) => void;
}) => {
  const { setIsOpenedSideBar, showSearchModal, setShowSearchModal } =
    useContext(AuthenticatedContext);

  return (
    <>
      <aside className="flex pt-2 flex-col w-full h-full bg-gray-900">
        <header className="flex items-center my-2 justify-between text-gray-200 h-6 px-3">
          <h3 className="font-bold text-lg">Gemma3</h3>
          <button
            data-hover="Close Sidebar"
            onClick={() => setIsOpenedSideBar(false)}
            className="font-bold text-xl cursor-pointer p-2 hover:after:content-[attr(data-hover)] hover:after:fixed hover:after:bg-gray-600/60 hover:after:rounded-xl hover:after:p-2 hover:after:text-xs hover:after:top-3 hover:after:ml-4"
          >
            <Sidebar className="w-5 h-5" />
          </button>
        </header>
        <section className="flex flex-col border-t border-gray-600 w-full ps-2 pt-1 flex-1 my-2 overflow-y-auto scrollable">
          <Link
            to={"/"}
            className="flex gap-2 mt-1 cursor-pointer p-2 rounded-xl hover:bg-gray-700"
          >
            <Edit className="w-3 h-3 mt-0.5" />
            <p>New Chat</p>
          </Link>
          <button
            onClick={() => setShowSearchModal(!showSearchModal)}
            className="flex gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700"
          >
            <Search className="w-3 h-3 mt-0.5" />
            <p>Search Chats</p>
          </button>
          {/* Chat Items */}
          <Chats
            handleArchive={handleArchive}
            conversations={conversations}
            conversation_id={conversation_id}
          />
        </section>
      </aside>

      <SearchModal
        show={showSearchModal}
        conversation_id={conversation_id ?? null}
        groupedConversations={conversations}
        setShowSearchModal={() => setShowSearchModal(!showSearchModal)}
      />
    </>
  );
};

export default SideBar;
