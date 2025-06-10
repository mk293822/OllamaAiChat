import { useContext } from "react";
import { ConversationContext } from "../Context/Contexts";

const useConversation = () => {
  const context = useContext(ConversationContext);
      if (!context)
          throw new Error("useAuthUserContext must be used within Provider");
      return context;
}

export default useConversation
