import React, { type PropsWithChildren } from "react";
import SideBar from "../Components/SideBar";

const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex bg-gray-100 text-xs dark:bg-gray-900 text-gray-900 dark:text-white">
      <SideBar />
      <main className="flex-1 text-xs">{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
