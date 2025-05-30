// components/ui/button.tsx
import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl px-4 py-2 font-medium transition duration-200 focus:outline-none",
        className
      )}
    >
      {children}
    </button>
  );
};
