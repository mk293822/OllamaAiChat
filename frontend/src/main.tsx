import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Welcome from "./Pages/Welcome.tsx";
import PageNotFound from "./Pages/Error/PageNotFound.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Register from "./Pages/Auth/Register.tsx";
import { authRoutes, errorRoutes, routes } from "./routes.ts";
import Dashboard from "./Pages/Dashboard.tsx";

const paths = [
  { path: routes.welcome, element: <Welcome /> },
  { path: routes.dashboard, element: <Dashboard /> },

  // Authentication Pages
  { path: authRoutes.login, element: <Login /> },
  { path: authRoutes.register, element: <Register /> },

  // error pages
  { path: errorRoutes.notFound, element: <PageNotFound /> },
];

const router = createBrowserRouter(paths);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
