import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout.tsx";
import GuestLayout from "./Layouts/GuestLayout.tsx";
import { routes } from "./routes.ts";
import { UserContext } from "./Context/UserContext.tsx";


export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const {token} = useContext(UserContext);
  if (!token) return <Navigate to={routes.welcome} replace />;
  return children;
};


export const RequireGuest = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(UserContext);

  if (token) return <Navigate to={routes.dashboard} replace />;
  return children;
};

export const LayoutDecider = () => {
  const { token } = useContext(UserContext);

  return token ? <AuthenticatedLayout /> : <GuestLayout />;
};
