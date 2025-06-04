import { useContext, useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import UserContext from "../Context/UserContext";

const GuestLayout = ({ children }: PropsWithChildren) => {
  const { token, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !loading) {
      navigate(routes.dashboard);
    }
  }, [navigate, token, loading]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main>{children}</main>
    </div>
  );
};

export default GuestLayout;
