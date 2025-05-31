import { MoreVertical } from "feather-icons-react"
import { useContext, useState } from "react";
import UserContext from "../Context/UserContext";
import Dropdown from "./DropDown";
import { getCookie } from "../helper";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import ErrorModal from "./ErrorModal";

const NavBar = () => {
  const { user, logout, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = getCookie("auth_token");
  const [error, setError] = useState<null | string>(null);

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decodeURIComponent(token ?? "")}`,
      },
    });

    if (res.ok) {
      logout();
      refreshUser();
      navigate(routes.welcome);
    } else {
      setError(res.statusText);
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

export default NavBar
