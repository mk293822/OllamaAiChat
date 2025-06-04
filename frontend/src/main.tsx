import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Welcome from "./Pages/Welcome.tsx";
import PageNotFound from "./Pages/Error/PageNotFound.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Register from "./Pages/Auth/Register.tsx";
import { authRoutes, errorRoutes, routes } from "./routes.ts";
import Dashboard from "./Pages/Dashboard.tsx";
import UserContextProvider from "./Context/UserContextProvider.tsx";
import Forbidden from "./Pages/Error/Forbidden.tsx";

const paths = [
  { path: routes.dashboard, element: <Dashboard /> },
  { path: routes.chat, element: <Dashboard /> },
  { path: routes.welcome, element: <Welcome /> },

  // Authentication Pages
  { path: authRoutes.login, element: <Login /> },
  { path: authRoutes.register, element: <Register /> },

  // error pages
  { path: errorRoutes.notFound, element: <PageNotFound /> },
  { path: errorRoutes.forbidden, element: <Forbidden /> },
];

const router = createBrowserRouter(paths);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
