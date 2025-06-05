import { useContext, useEffect, useRef, useState } from "react";
import InputForm from "../Components/InputForm";
import OutputMessage from "../Components/OutputMessage";
import ErrorModal from "../Components/ErrorModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import { authRoutes } from "../routes";
import { UserContext } from "../Context/Contexts";

interface StreamResponse {
  body: ReadableStream<Uint8Array> | null;
}

interface LocalResponse {
  role: string;
  content: string;
}

const Dashboard = () => {
  const { localMessages, conversationId } = useOutletContext<{
    localMessages: LocalResponse[];
    conversationId: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [localResponses, setLocalResponses] = useState<LocalResponse[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  // Set the messages
  useEffect(
    () => localMessages && setLocalResponses(localMessages),
    [localMessages]
  );

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
      const res = await fetch(`/api/ask/${conversationId ?? null}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeURIComponent(token ?? "")}`,
        },
        body: JSON.stringify({ text: text }),
        signal: controllerRef.current.signal,
      });

      const newConversationId = res.headers.get("X-Convo-Id");
      if (!conversationId && newConversationId) {
        await navigate(`/c/${newConversationId}`, { replace: true });
      }

      await handleStreamResponse(res);
      // Stream resonse
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate(authRoutes.login);
        setError(error.response.statusText);
      } else {
        setError(error.response.statusText);
      }
    } finally {
      setLoading(false);
    }
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
          await new Promise<void>((resolve) => setTimeout(resolve, 10)); // typing speed

          currentText += char;

          // Update state with new array (live typing)
          setLocalResponses((prev: LocalResponse[]) => {
            const updated = [...prev];
            updated[updated.length - 1].content = currentText; // update last message
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
    <>
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

      {/* Error */}
      {error && <ErrorModal message={error} />}
    </>
  );
};

export default Dashboard;
