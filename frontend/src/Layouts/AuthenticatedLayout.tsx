import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import { Outlet, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthenticatedContext } from "../Context/Contexts";
import type { GroupedConversation } from "../types";
import ErrorModal from "../Components/ErrorModal";

interface LocalResponse {
  role: string;
  content: string;
}

const AuthenticatedLayout = () => {
  const [localMessages, setLocalMessages] = useState<LocalResponse[]>([]);
  const { conversation_id } = useParams();
  const [conversations, setConversations] = useState<GroupedConversation>();
  const { isOpenedSideBar, deletedConversationIds } =
    useContext(AuthenticatedContext);
  const [filteredConversations, setFilteredConversations] =
    useState<GroupedConversation>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get the messages of the conversation
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await api.get(
          `/api/getMessages/${conversation_id ?? null}`
        );
        setLocalMessages(response.data.messages ?? []);
        setConversations(response.data.conversations);
      } catch (error: any) {
        setErrorMessage(error.response.statusText);
      }
    };
    getMessages();
  }, [conversation_id]);

  useEffect(() => {
    if (conversations) {
      setFilteredConversations(() => {
        const updated = conversations;

        deletedConversationIds.forEach((id) => {
          for (const group in updated) {
            const key = group as keyof GroupedConversation;
            updated[key] = updated[key]?.filter((con) => con.id !== id);
          }
        });

        return updated;
      });
    }
  }, [deletedConversationIds, conversations]);

  const handleArchive = async (conversation_id: string | null) => {
    try {
      await api.post(`/api/archiveConversation/${conversation_id ?? null}`);

      setFilteredConversations((pre) => {
        const filtered = { ...pre };

        for (const group in filtered) {
          const key = group as keyof GroupedConversation;
          filtered[key] = filtered[key]?.filter(
            (con) => con.id !== conversation_id
          );
        }
        return filtered;
      });
    } catch (error: any) {
      setErrorMessage(error.response.statusText);
    }
  };

  return (
    <div className=" bg-gray-100 flex h-screen text-xs dark:bg-gray-900 text-gray-900 dark:text-white">
      <div
        className={`transition-all md:block md:relative fixed h-screen z-50 duration-300 ${
          isOpenedSideBar
            ? "w-64 md:w-52 lg:w-64 shadow-lg shadow-black md:shadow-none"
            : "w-0 hidden"
        } overflow-hidden`}
      >
        <SideBar
          conversations={filteredConversations}
          conversation_id={conversation_id ?? null}
          handleArchive={handleArchive}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <NavBar
          conversation_id={conversation_id ?? null}
          handleArchive={handleArchive}
        />
        <main className="text-xs flex-1">
          <Outlet
            context={{
              localMessages: localMessages,
              conversationId: conversation_id,
            }}
          />
        </main>
      </div>

      {errorMessage && <ErrorModal message={errorMessage} />}
    </div>
  );
};

export default AuthenticatedLayout;
