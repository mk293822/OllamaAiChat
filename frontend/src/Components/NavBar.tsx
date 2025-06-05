import {
  AlignJustify,
  Archive,
  Edit,
  LogOut,
  MoreVertical,
  Settings,
  Sidebar,
  Trash2,
} from "feather-icons-react";
import { useContext, useEffect, useState } from "react";
import { AuthenticatedContext, UserContext } from "../Context/Contexts";
import Dropdown from "./DropDown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import ErrorModal from "./ErrorModal";
import api from "../api";

const NavBar = () => {
  const { user, token, logout } = useContext(UserContext);
  const {
    isOpenedSideBar,
    setIsOpenedSideBar,
    error,
    handleDeleteConversation,
  } = useContext(AuthenticatedContext);
  const navigate = useNavigate();
  const { conversation_id } = useParams();
  const [navError, setNavError] = useState<string | null>(null);

  useEffect(() => setNavError(error), [error]);

  // Logout submittion
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
        setNavError("Logout failed: " + error.message);
      }
    }
  };

  const handleDelete = () => {
    handleDeleteConversation(conversation_id ?? null);
    if (!error) navigate(routes.dashboard);
  };

  return (
    <>
      <nav className="w-full bg-gray-800 text-gray-100 flex justify-between items-center h-14 px-4">
        <div>
          <div className="flex md:hidden">
            {/* Always show on small screens (below md) */}
            <button
              onClick={() => setIsOpenedSideBar(true)}
              className="font-bold text-xl cursor-pointer hover:bg-gray-600 p-2 rounded-xl"
            >
              <AlignJustify className="w-6 h-6" />
            </button>
            <Link
              to={"/"}
              className="font-bold text-xl cursor-pointer hover:bg-gray-600 p-2 rounded-xl"
            >
              <Edit className="w-5 h-5" />
            </Link>
          </div>

          {/* Show only when !isOpenedSideBar and screen is md+ */}
          {!isOpenedSideBar && (
            <div className="hidden md:flex">
              <button
                onClick={() => setIsOpenedSideBar(true)}
                className="font-bold text-xl cursor-pointer hover:bg-gray-600 p-2 rounded-xl"
              >
                <Sidebar className="w-5 h-5" />
              </button>
              <Link
                to={"/"}
                className="font-bold mb-0.5 text-xl cursor-pointer hover:bg-gray-600 p-2 rounded-xl"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <p className="text-xl font-bold mt-1 ms-2">Gemma3</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center justify-center">
          {conversation_id && (
            <div className="cursor-pointer hover:bg-gray-700 rounded-full p-1">
              <Dropdown>
                <Dropdown.Trigger>
                  <MoreVertical className="w-5 h-5 text-gray-200" />
                </Dropdown.Trigger>

                <Dropdown.Content>
                  <hr className="mb-2 text-gray-400" />

                  <Dropdown.Button onClick={handleDelete}>
                    <div className="flex gap-2 justify-start text-red-300 items-center">
                      <Trash2 size={15} />
                      Delete
                    </div>
                  </Dropdown.Button>
                  <Dropdown.Button onClick={handleLogout}>
                    <div className="flex gap-2 justify-start items-center">
                      <Archive size={15} />
                      Archived
                    </div>
                  </Dropdown.Button>
                </Dropdown.Content>
              </Dropdown>
            </div>
          )}

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
                <p>{user?.email}</p>
                <hr className="my-2 text-gray-400" />
                <Dropdown.Button onClick={handleLogout}>
                  <div className="flex items-center justify-start gap-2">
                    <Settings size={15} />
                    Settings
                  </div>
                </Dropdown.Button>
                <Dropdown.Button onClick={handleLogout}>
                  <div className="flex items-center justify-start gap-2">
                    <LogOut size={15} />
                    Logout
                  </div>
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Error */}
      {navError && <ErrorModal message={navError} />}
    </>
  );
};

export default NavBar;
