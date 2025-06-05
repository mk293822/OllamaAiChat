import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import paths from "./paths";
import UserContextProvider from "./Context/UserContextProvider";
import AuthenticatedContextProvider from "./Context/AuthenticatedContextProvider";


const router = createBrowserRouter(paths);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <AuthenticatedContextProvider>
        <RouterProvider router={router} />
      </AuthenticatedContextProvider>
    </UserContextProvider>
  </StrictMode>
);
