import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import { Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
  return (
    <div className="flex bg-gray-100 text-xs dark:bg-gray-900 text-gray-900 dark:text-white">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="text-xs flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
