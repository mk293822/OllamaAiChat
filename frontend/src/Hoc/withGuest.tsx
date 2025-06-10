import { Navigate } from "react-router-dom";
import { routes } from "../routes";
import useAuth from "../Hooks/useAuth";

const withGuest = <T extends object>(
	Component: React.ComponentType<React.PropsWithChildren<T>>
) => {
	return (props: React.PropsWithChildren<T>) => {
		const { token } = useAuth();

		if (token) {
			return <Navigate to={routes.dashboard} replace />;
		}

		return <Component {...props} />;
	};
};

export default withGuest;
