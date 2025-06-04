import Welcome from "./Pages/Welcome.tsx";
import PageNotFound from "./Pages/Error/PageNotFound.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Register from "./Pages/Auth/Register.tsx";
import { authRoutes, errorRoutes, routes } from "./routes.ts";
import Dashboard from "./Pages/Dashboard.tsx";
import Forbidden from "./Pages/Error/Forbidden.tsx";
import {
  LayoutDecider,
  RequireAuth,
  RequireGuest,
} from "./getAuthentication.tsx";

const paths = [
  {
    path: "/",
    element: <LayoutDecider />,
    children: [
      // Authenticated pages
      {
        path: routes.dashboard,
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: routes.chat,
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },

      // Guest pages
      {
        path: routes.welcome,
        element: (
          <RequireGuest>
            <Welcome />
          </RequireGuest>
        ),
      },
      {
        path: authRoutes.login,
        element: (
          <RequireGuest>
            <Login />
          </RequireGuest>
        ),
      },
      {
        path: authRoutes.register,
        element: (
          <RequireGuest>
            <Register />
          </RequireGuest>
        ),
      },
    ],
  },

  // Error pages
  { path: errorRoutes.notFound, element: <PageNotFound /> },
  { path: errorRoutes.forbidden, element: <Forbidden /> },
];

export default paths;