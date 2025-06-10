import { Archive, MoreVertical, Trash2 } from "feather-icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Conversation, GroupedConversation } from "../types";
import { routes } from "../routes";
import Dropdown from "./DropDown";
import useAuthUserContext from "../Hooks/useAuthUserContext";
import useConversation from "../Hooks/useConversation";
import useError from "../Hooks/useError";

const Chats = ({
	conversations,
}: {
	conversations: GroupedConversation | undefined;
}) => {
	const { setShowSearchModal } = useAuthUserContext();
	const { conversation_id } = useParams();
	const { handleArchive, handleDeleteConversation } = useConversation();
	const { errorMessage } = useError();

	const navigate = useNavigate();

	const handleDelete = (conversation: Conversation) => {
		if (conversation) {
			handleDeleteConversation(conversation);
		}
		if (!errorMessage && conversation.id === conversation_id)
			navigate(routes.dashboard);
	};

	return (
		<section>
			<div className="flex flex-col gap-2 py-2 text-xs">
				{/* day */}
				{conversations &&
					Object.entries(conversations).map(
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
													onClick={() => setShowSearchModal(false)}
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
															onClick={() => handleDelete(conversation)}
														>
															<div className="flex gap-2 justify-start text-red-300 items-center">
																<Trash2 size={15} />
																Delete
															</div>
														</Dropdown.Button>
														<Dropdown.Button
															onClick={() => handleArchive(conversation)}
														>
															<div className="flex gap-2 justify-start items-center">
																<Archive size={15} />
																{conversation.archived ? "UnArchive": "Archive"}
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
