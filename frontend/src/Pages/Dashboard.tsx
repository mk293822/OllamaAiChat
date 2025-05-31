import { useRef, useState } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import InputForm from "../Components/InputForm";
import { getCookie } from "../helper";
import OutputMessage from "../Components/OutputMessage";
import ErrorModal from "../Components/ErrorModal";

interface StreamResponse {
  body: ReadableStream<Uint8Array> | null;
}

interface LocalResponse {
  request: string;
  response: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [localResponses, setLocalResponses] = useState<LocalResponse[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    if (controllerRef.current) {
      controllerRef.current.abort(); // stop previous
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const token = getCookie("auth_token");

    // Now send streaming fetch request
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeURIComponent(token ?? "")}`,
      },
      body: JSON.stringify({ text: text }),
      signal: controllerRef.current.signal,
    });

    if (res.ok) {
      setLocalResponses((prev) => [...prev, { request: text, response: "." }]);
      await handleStreamResponse(res);
    } else {
      setError(res.statusText);
    }
  };

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
          setLoading(false);
          break;
        }

        const chunk: string = decoder.decode(value, { stream: true });

        for (const char of chunk) {
          await new Promise<void>((resolve) => setTimeout(resolve, 30)); // typing speed

          currentText += char;

          // Update state with new array (live typing)
          setLocalResponses((prev: LocalResponse[]) => {
            const updated = [...prev];
            updated[updated.length - 1].response = currentText; // update last message
            return updated;
          });
        }
      }
    }
  };

  const stopContent = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800">
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
    </AuthenticatedLayout>
  );
};

export default Dashboard;
