import { Outlet } from "react-router-dom";
import useError from "../Hooks/useError";
import ErrorModal from "../Components/ErrorModal";
import withGuest from "../Hoc/withGuest";

const Layout = () => {
	const { errorMessage } = useError();

	return (
		<>
			<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
				<main>
					<Outlet />
				</main>
			</div>

			{errorMessage && <ErrorModal message={errorMessage} />}
		</>
	);
};

const GuestLayout = withGuest(Layout);

export default GuestLayout;
