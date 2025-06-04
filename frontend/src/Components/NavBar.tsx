import { MoreVertical } from "feather-icons-react";
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import Dropdown from "./DropDown";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import ErrorModal from "./ErrorModal";
import api from "../api";

const NavBar = () => {
  const { user, token, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState<null | string>(null);

  const handleLogout = async () => {
    try {
      if (token) {
        await api.post("/api/logout");
        logout();
        navigate(routes.welcome);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate(routes.welcome);
      } else {
        setError("Logout failed: " + error.message);
      }
    }
  };

  return (
    <>
      <nav className="w-full bg-gray-800 text-gray-100 flex justify-between items-center h-14 px-8">
        <div className=""></div>
        <div className="flex gap-2 items-center justify-center">
          <div className="cursor-pointer hover:bg-gray-700 rounded-full p-1">
            <MoreVertical className="w-5 h-5 text-gray-200" />
          </div>

          <div className="relative ms-3">
            <Dropdown>
              <Dropdown.Trigger>
                <div className="h-6 w-6 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <span className="text-md">
                    {user?.name.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <Dropdown.Button onClick={handleLogout}>Logout</Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Error */}
      {error && <ErrorModal message={error} />}
    </>
  );
};

export default NavBar;
