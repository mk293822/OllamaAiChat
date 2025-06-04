import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";

const Forbidden = () => {
  const { token } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(routes.dashboard);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-800 items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">403</h1>
      <p className="text-xl text-gray-400 mb-6">
        Access Denied. You don’t have permission to view this page.
      </p>
      <Link
        to={routes.welcome}
        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Forbidden;
