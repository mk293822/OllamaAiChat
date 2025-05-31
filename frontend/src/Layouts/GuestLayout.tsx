import type { PropsWithChildren } from "react";

const GuestLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main>{children}</main>
    </div>
  );
};

export default GuestLayout;
