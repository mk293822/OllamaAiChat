import {
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { AuthenticatedContext, UserContext } from "./Contexts";
import api from "../api";

const AuthenticatedContextProvider = ({ children }: PropsWithChildren) => {
  const [isOpenedSideBar, setIsOpenedSideBar] = useState(true);
  const [deletedConversationIds, setDeletedConversationIds] = useState<
    (string | undefined)[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(UserContext);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Delete Conversation
  const handleDeleteConversation = useCallback(
    async (conversationId: string | null) => {
      try {
        if (token && conversationId) {
          await api.post(`/api/destory/${conversationId}`);
          setDeletedConversationIds((pre) => [...pre, conversationId]);
        } else {
          setError(`Conversation id is ${conversationId}`);
        }
      } catch (error: any) {
        setError("Conversation deletion failed: " + error.message);
      }
    },
    [token]
  );

  const contextValue = useMemo(
    () => ({
      isOpenedSideBar,
      setIsOpenedSideBar,
      error,
      handleDeleteConversation,
      deletedConversationIds,
      showSearchModal,
      setShowSearchModal,
    }),
    [
      isOpenedSideBar,
      setIsOpenedSideBar,
      error,
      handleDeleteConversation,
      deletedConversationIds,
      showSearchModal,
      setShowSearchModal,
    ]
  );

  return (
    <AuthenticatedContext.Provider value={contextValue}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export default AuthenticatedContextProvider;
