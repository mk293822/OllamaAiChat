import { Archive, X } from "feather-icons-react";
import Modal from "./Modal";
import { type Dispatch, type SetStateAction } from "react";
import Chats from "./Chats";
import useConversation from "../Hooks/useConversation";

const SettingModal = ({setShowSettingModal, showSettingModal}: {showSettingModal: boolean, setShowSettingModal: Dispatch<SetStateAction<boolean>>}) => {

	const {archivedConversations} = useConversation();

	return (
		<Modal show={showSettingModal} onClose={() => setShowSettingModal(false)}>
			<div className="flex flex-col min-h-80 text-gray-200 px-4 py-6">
				<header className="relative ps-2">
					<h1 className="flex gap-3 items-center justify-start">
						<span><Archive size={20} /></span>
						{" "}Archived Chats</h1>
					<button onClick={() => setShowSettingModal(false)}>
						<X className="absolute right-0 -top-1 hover:cursor-pointer p-1 rounded-full hover:bg-gray-600 w-6 h-6" />
					</button>
				</header>
				<Chats conversations={archivedConversations}/>
			</div>
		</Modal>
	);
};

export default SettingModal;
