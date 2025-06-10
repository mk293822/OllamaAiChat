import { useEffect, useRef, useState } from "react";
import InputForm from "../Components/InputForm";
import OutputMessage from "../Components/OutputMessage";
import { useNavigate, useParams } from "react-router-dom";
import { authRoutes } from "../routes";
import axios from "axios";
import useError from "../Hooks/useError";
import useAuth from "../Hooks/useAuth";
import api from "../api";
import useRefreshToken from "../Hooks/useRefreshToken";

interface StreamResponse {
	body: ReadableStream<Uint8Array> | null;
}

interface LocalResponse {
	role: string;
	content: string;
}

const Dashboard = () => {
	const [loading, setLoading] = useState(false);
	const [localResponses, setLocalResponses] = useState<LocalResponse[]>([]);
	const controllerRef = useRef<AbortController | null>(null);
	const navigate = useNavigate();
	const { token } = useAuth();
	const { conversation_id } = useParams();
	const { setErrorMessage } = useError();
	const refreshToken = useRefreshToken();

	useEffect(() => {
		if (!conversation_id) setLocalResponses([]);
	}, [conversation_id]);

	// Get the messages of the conversation
	useEffect(() => {
		const controller = new AbortController();
		const getMessages = async () => {
			try {
				const response = await api.get(
					`/api/getMessages/${conversation_id ?? null}`,
					{ signal: controller.signal }
				);
				setLocalResponses(response.data.messages ?? []);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (!token)
						setErrorMessage(error.response ? error.response.statusText : null);
				} else {
					console.log(error);
				}
			}
		};

		if (conversation_id && token) getMessages();

		return () => controller.abort();
	}, [conversation_id, setErrorMessage, token]);

	// Handle the submittion of the chat
	const handleSubmit = async (text: string) => {
		setLoading(true);
		if (controllerRef.current) {
			controllerRef.current.abort(); // stop previous
		}

		const controller = new AbortController();
		controllerRef.current = controller;

		setLocalResponses((prev) => [...prev, { role: "user", content: text }]);
		setLocalResponses((prev) => [
			...prev,
			{ role: "assistant", content: "..." },
		]);
		try {
			const res = await handleFetch({ text, token });
			if (res.status === 401) {
				const newToken = await refreshToken();

				const retryRes = await handleFetch({ text, token: newToken });
				if (!retryRes.ok) {
					setErrorMessage(`Retry failed with status ${retryRes.status}`);
				}
			} else if (!res.ok && res.status !== 401) {
				setErrorMessage(`Something went wrong. Please try again.`);
			}
		} catch (error) {
			// You probably want to redirect user only on 401
			if (error instanceof Error && error.message.includes("401")) {
				navigate(authRoutes.login);
				setErrorMessage("Unauthorized. Please log in again.");
			} else {
				setErrorMessage("Something went wrong. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleFetch = async ({
		text,
		token,
	}: {
		text: string;
		token: string | null;
	}) => {
		const res = await fetch(`/api/ask/${conversation_id ?? null}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${decodeURIComponent(token ?? "")}`,
			},
			body: JSON.stringify({ text: text }),
			signal: controllerRef.current?.signal,
		});

		if (res.ok) {
			const newConversationId = res.headers.get("X-Convo-Id");
			if (!conversation_id && newConversationId) {
				await navigate(`/c/${newConversationId}`, { replace: true });
			}

			await handleStreamResponse(res);
		}

		return res;
	};

	// Handle the Stream Response form form
	const handleStreamResponse = async (res: StreamResponse): Promise<void> => {
		const reader: ReadableStreamDefaultReader<Uint8Array> | undefined =
			res.body?.getReader();
		const decoder = new TextDecoder("utf-8");

		if (reader) {
			let currentText = "";

			while (true) {
				const { done, value }: { done: boolean; value?: Uint8Array } =
					await reader.read();
				if (done) {
					break;
				}

				const chunk: string = decoder.decode(value, { stream: true });

				for (const char of chunk) {
					currentText += char;

					// Update state with new array (live typing)
					setLocalResponses((prev: LocalResponse[]) => {
						const updated = [...prev];
						const lastIndex = updated.length - 1;

						if (lastIndex >= 0 && updated[lastIndex]) {
							updated[lastIndex] = {
								...updated[lastIndex],
								content: currentText,
							};
						}
						return updated;
					});
				}
			}
		}
	};

	// Stop the request
	const stopContent = () => {
		if (controllerRef.current) {
			controllerRef.current.abort();
			controllerRef.current = null;
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800">
			{/* Chat Container */}
			<OutputMessage localResponses={localResponses} />

			{localResponses.length < 1 && (
				<div className="mx-auto block w-auto text-2xl pb-8 pr-12 font-semibold">
					What Can I Help You Today?
				</div>
			)}

			{/* Input Bar */}
			<InputForm
				loading={loading}
				handleSubmit={handleSubmit}
				stopContent={stopContent}
			/>
		</div>
	);
};

export default Dashboard;
