import { useMemo, useState, type PropsWithChildren } from "react";
import { AuthenticatedUserContext } from "./Contexts";

const AuthUserContextProvider = ({ children }: PropsWithChildren) => {
	const [isOpenedSideBar, setIsOpenedSideBar] = useState(true);
	const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
	const [conversationId, setConversationId] = useState<string | null>(null);

	const contextValue = useMemo(
		() => ({
			isOpenedSideBar,
			setIsOpenedSideBar,
			showSearchModal,
			setShowSearchModal,
			conversationId,
			setConversationId,
		}),
		[
			isOpenedSideBar,
			setIsOpenedSideBar,
			showSearchModal,
			setShowSearchModal,
			conversationId,
			setConversationId,
		]
	);

	return (
		<AuthenticatedUserContext.Provider value={contextValue}>
			{children}
		</AuthenticatedUserContext.Provider>
	);
};

export default AuthUserContextProvider;
