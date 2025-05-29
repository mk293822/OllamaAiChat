import { useRef, useState } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import InputForm from "../Components/InputForm";
import { getCookie } from "../helper";
import OutputMessage from "../Components/OutputMessage";

const Welcome = () => {
  const [loading, setLoading] = useState(false);
  const [localResponses, setLocalResponses] = useState<
    Array<{
      request: string;
      response: string;
    }>
  >([]);
  const controllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    if (controllerRef.current) {
      controllerRef.current.abort(); // stop previous
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Get CSRF token first
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const csrfToken = getCookie("XSRF-TOKEN");

      setLocalResponses((prev) => [...prev, { request: text, response: "" }]);
      // Now send streaming fetch request
      const res = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken ?? ""),
        },
        credentials: "include", // Required to include the session cookie
        body: JSON.stringify({ text: text }),
        signal: controllerRef.current.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let currentText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          for (const char of chunk) {
            await new Promise((resolve) => setTimeout(resolve, 10)); // typing speed

            currentText += char;

            // Update state with new array (live typing)
            setLocalResponses((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].response = currentText; // update last message
              return updated;
            });
          }
        }
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        "message" in error &&
        (error as { name: string }).name !== "AbortError" &&
        (error as { message: string }).message !== "The user aborted a request."
      ) {
        console.error("Error in handleSubmit:", error);
      }
    } finally {
      setLoading(false);
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
      <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
        {/* Chat Container */}
        <OutputMessage localResponses={localResponses} />

        {/* Input Bar */}
        <InputForm
          loading={loading}
          handleSubmit={handleSubmit}
          stopContent={stopContent}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Welcome;
