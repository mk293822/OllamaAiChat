import { Archive, MoreVertical, Trash2 } from "feather-icons-react";
import { Link, useNavigate } from "react-router-dom";
import type { GroupedConversation } from "../types";
import { useContext, useEffect, useState } from "react";
import { AuthenticatedContext } from "../Context/Contexts";
import { routes } from "../routes";
import Dropdown from "./DropDown";

const Chats = ({
  conversations,
  conversation_id,
  setShowSearchModal,
  handleArchive,
}: {
  conversations: GroupedConversation | undefined;
  conversation_id: string | null;
  setShowSearchModal?: () => void;
  handleArchive: (id: string | null) => void;
}) => {
  const [groupedConversations, setGroupedConversations] = useState<
    GroupedConversation | undefined
  >(conversations);

  const { handleDeleteConversation, error } = useContext(AuthenticatedContext);
  const navigate = useNavigate();

  useEffect(
    () => conversations && setGroupedConversations(conversations),
    [conversations]
  );

  const filterConversation = (id: string | null) => {
    if (conversations) {
      setGroupedConversations((pre) => {
        const updated = { ...pre };

        for (const group in updated) {
          const key = group as keyof GroupedConversation;
          updated[key] = updated[key]?.filter((con) => con.id !== id);
        }

        return updated;
      });
    }
  };

  const handleDelete = (conversationId: string | null) => {
    if (conversationId) {
      handleDeleteConversation(conversationId);
      filterConversation(conversationId);
    }
    if (!error && conversation_id === conversationId)
      navigate(routes.dashboard);
  };

  return (
    <section>
      <div className="flex flex-col gap-2 py-2 text-xs">
        {/* day */}
        {groupedConversations &&
          Object.entries(groupedConversations).map(
            ([group, conversations]) =>
              conversations.length > 0 && (
                <div key={group}>
                  <span className="text-xs text-gray-400 ps-2">{group}</span>
                  <div className="flex flex-col text-gray-100 w-full mt-2">
                    {/* Chat Items */}
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="relative group cursor-pointer hover:bg-gray-600 rounded-xl"
                      >
                        <Link
                          to={`/c/${conversation.id}`}
                          onClick={setShowSearchModal}
                          className="block max-w-[100%] overflow-hidden text-ellipsis p-2 z-10 whitespace-nowrap group-hover:mr-6"
                        >
                          {conversation.title}
                        </Link>

                        <Dropdown>
                          <Dropdown.Trigger>
                            <button className="absolute right-1 -top-5 -translate-y-2 hidden group-hover:block text-gray-200">
                              <MoreVertical className="w-6 h-6 cursor-pointer hover:bg-gray-500 rounded-full p-1" />
                            </button>
                          </Dropdown.Trigger>

                          <Dropdown.Content>
                            <Dropdown.Button
                              onClick={() => handleDelete(conversation.id)}
                            >
                              <div className="flex gap-2 justify-start text-red-300 items-center">
                                <Trash2 size={15} />
                                Delete
                              </div>
                            </Dropdown.Button>
                            <Dropdown.Button
                              onClick={() => handleArchive(conversation.id)}
                            >
                              <div className="flex gap-2 justify-start items-center">
                                <Archive size={15} />
                                Archived
                              </div>
                            </Dropdown.Button>
                          </Dropdown.Content>
                        </Dropdown>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
      </div>
    </section>
  );
};

export default Chats;
