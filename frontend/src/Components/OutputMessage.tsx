import clsx from "clsx";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "../index.css";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  localResponses: Array<{
    role: string;
    content: string;
  }>;
}

const OutputMessage = ({ localResponses }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localResponses]);

  return (
    <div
      className={clsx(
        "overflow-y-auto w-full py-6 space-y-8 scrollable",
        localResponses.length > 0 ? "flex-1" : ""
      )}
    >
      {localResponses?.map((res, index) => (
        <div
          key={index}
          className="w-[55%] ps-6 mx-auto flex flex-col justify-start gap-4"
        >
          {res.role === "user" && (
            <p className="bg-gray-700 max-w-sm rounded-2xl px-4 py-2 self-end me-12 mb-8">
              {res.content}
            </p>
          )}
          {res.role === "assistant" && (
            <ReactMarkdown
              components={{
                code({className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className ?? "");

                  if (match) {
                    return (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }

                  // Inline code styling
                  return (
                    <code
                      className={clsx(
                        "bg-gray-700 text-sm px-1 py-1 rounded",
                        "font-bold text-gray-300",
                        "leading-loose"
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {res.content}
            </ReactMarkdown>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default OutputMessage;
