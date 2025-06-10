import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import paths from "./paths";
import AuthContextProvider from "./Context/AuthContextProvider";
import AuthUserContextProvider from "./Context/AuthUserContextProvider";
import ErrorContextProvider from "./Context/ErrorContextProvider";
import ConversationContextProvider from "./Context/ConversationContextProvider";

const router = createBrowserRouter(paths);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorContextProvider>
			<AuthContextProvider>
				<AuthUserContextProvider>
					<ConversationContextProvider>
						<RouterProvider router={router} />
					</ConversationContextProvider>
				</AuthUserContextProvider>
			</AuthContextProvider>
		</ErrorContextProvider>
	</StrictMode>
);
