import { StrictMode, useState } from "react";
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
  { path: routes.welcome, element: <Welcome /> },
  { path: routes.dashboard, element: <Dashboard /> },

  // Authentication Pages
  { path: authRoutes.login, element: <Login /> },
  { path: authRoutes.register, element: <Register /> },

  // error pages
  { path: errorRoutes.notFound, element: <PageNotFound /> },
  { path: errorRoutes.forbidden, element: <Forbidden /> },
];

const router = createBrowserRouter(paths);

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleReady = () => {
    setIsLoading(false);
  };

  return (
    <StrictMode>
      <UserContextProvider onReady={handleReady}>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p className="text-xl animate-pulse">Checking access...</p>
          </div>
        ) : (
          <RouterProvider router={router} />
        )}
      </UserContextProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
