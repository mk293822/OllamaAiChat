import React, { useState } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Welcome = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  function getCookie(name: string) {
      const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get CSRF token first
      await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const csrfToken = getCookie("XSRF-TOKEN");

      // Now send streaming fetch request
      const res = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken ?? ""),
        },
        credentials: "include", // Required to include the session cookie
        body: JSON.stringify({ text: text }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        setResponse(""); // Clear previous response

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          for (const char of chunk) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // typing speed
            setResponse((prev) => prev + char);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <GuestLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Chat with AI
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Ask me something..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              rows={4}
            />
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Submit
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Response:</h3>
            <div className="max-w-none prose p-4">
              <ReactMarkdown
                children={response}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className ?? "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Welcome;
