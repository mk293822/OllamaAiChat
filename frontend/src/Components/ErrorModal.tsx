import { X } from "feather-icons-react";
import React, { useEffect, useState } from "react";

type ErrorModalProps = {
  message: string;
  duration?: number; // optional duration (ms)
};

const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
    duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 min-w-[250px] transition-all duration-300">
      <button
        className="absolute top-2 right-4 text-white hover:text-gray-400"
        onClick={() => setVisible(false)}
        aria-label="Close"
      >
        <X size={22} />
      </button>
      <p>{message}</p>
    </div>
  );
};

export default ErrorModal;
