import clsx from "clsx";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Send, StopCircle } from "feather-icons-react";
import "../index.css";

interface Props {
  handleSubmit: (e: string) => void;
  loading: boolean;
  stopContent: () => void;
}

const InputForm = ({ loading, handleSubmit, stopContent }: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const placeholder = "Type a message...";

  useEffect(() => {
    const el = inputRef.current;
    if (el && el.innerText.trim() === "") {
      setIsEmpty(true);
    }
  }, []);

  const handleInput = () => {
    const el = inputRef.current;
    if (!el) return;

    setIsEmpty(el.innerText.trim() === "");
  };

  const handleFocus = () => {
    if (isEmpty && inputRef.current) {
      inputRef.current.innerText = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = inputRef.current?.innerText.trim() || "";
      if (text !== "") {
        handleSubmit(text);
        if (inputRef.current) inputRef.current.innerText = "";
        setIsEmpty(true);
      }
    }
  };

  return (
    <div className="lg:w-[55%] w-[65%] md:w-[75%] mx-auto pb-4 flex gap-2 bg-transparent">
      <div
        ref={inputRef}
        contentEditable
        role="textbox"
        tabIndex={0}
        data-placeholder={placeholder}
        onInput={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={clsx(
          "flex-1 input-box max-h-28 overflow-y-auto p-3 text-wrap rounded-2xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ",
          isEmpty
            ? "text-gray-400 before:content-[attr(data-placeholder)] before:text-gray-400"
            : ""
        )}
        style={{
          position: "relative",
        }}
      />

      <button
        type={loading ? "button" : "submit"}
        onClick={() => {
          if (loading) {
            stopContent();
          } else {
            const text = inputRef.current?.innerText.trim() || "";
            if (text !== "") {
              handleSubmit(text);
              if (inputRef.current) inputRef.current.innerText = ""; // Clear input
            }
          }
        }}
        className={clsx(
          "transition text-white px-4 py-2 rounded-lg",
          !loading ? "bg-indigo-600 hover:bg-indigo-700" : "",
          loading ? "bg-red-600 hover:bg-red-700" : ""
        )}
      >
        {loading ? (
          <StopCircle className="w-4 h-4 text-white" />
        ) : (
          <Send className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
};

export default InputForm;
