import Welcome from "./Pages/Welcome.tsx";
import PageNotFound from "./Pages/Error/PageNotFound.tsx";
import Login from "./Pages/Auth/Login.tsx";
import Register from "./Pages/Auth/Register.tsx";
import { authRoutes, errorRoutes, routes } from "./routes.ts";
import Dashboard from "./Pages/Dashboard.tsx";
import Forbidden from "./Pages/Error/Forbidden.tsx";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout.tsx";
import GuestLayout from "./Layouts/GuestLayout.tsx";

const paths = [
	{
		path: "/",
		element: <AuthenticatedLayout />,
		children: [
			{ path: routes.dashboard, element: <Dashboard /> },
			{ path: routes.chat, element: <Dashboard /> },
		],
	},

	// Guest pages
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{ path: routes.welcome, element: <Welcome /> },
			{ path: authRoutes.login, element: <Login /> },
			{ path: authRoutes.register, element: <Register /> },
		],
	},

	// Error pages
	{ path: errorRoutes.notFound, element: <PageNotFound /> },
	{ path: errorRoutes.forbidden, element: <Forbidden /> },
];

export default paths;