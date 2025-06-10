import { Navigate } from "react-router-dom";
import { routes } from "../routes";
import useAuth from "../Hooks/useAuth";

const withAuth = <T extends object>(
	Component: React.ComponentType<React.PropsWithChildren<T>>
) => {
	return (props: React.PropsWithChildren<T>) => {
		const {token} = useAuth();

		if (!token) {
			return <Navigate to={routes.welcome} replace />;
		}

		return <Component {...props} />;
	};
};

export default withAuth;
