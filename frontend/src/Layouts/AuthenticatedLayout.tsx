import { useContext, useEffect, type PropsWithChildren } from "react";
import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import UserContext from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { errorRoutes } from "../routes";

const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  const { token, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !loading) {
      navigate(errorRoutes.forbidden);
    }
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
