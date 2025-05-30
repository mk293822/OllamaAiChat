import { useEffect, useState, type PropsWithChildren } from "react";
import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const res = await fetch("/api/user", {
      method: "GET",
    });

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchUser();
    if (!user) navigate(routes.welcome);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 text-xs dark:bg-gray-900 text-gray-900 dark:text-white">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="text-xs flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
