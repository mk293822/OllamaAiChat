import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthenticatedUserContext } from "../Context/Contexts";
import ErrorModal from "../Components/ErrorModal";
import withAuth from "../Hoc/withAuth";
import useError from "../Hooks/useError";

const Layout = () => {
	const { isOpenedSideBar } = useContext(AuthenticatedUserContext);
	const { errorMessage } = useError();

	return (
		<div className=" bg-gray-100 flex h-screen text-xs dark:bg-gray-900 text-gray-900 dark:text-white">
			<div
				className={`transition-all md:block md:relative fixed h-screen z-50 duration-300 ${
					isOpenedSideBar
						? "w-64 md:w-52 lg:w-64 shadow-lg shadow-black md:shadow-none"
						: "w-0 hidden"
				} overflow-hidden`}
			>
				<SideBar />
			</div>
			<div className="flex-1 flex flex-col">
				<NavBar />
				<main className="text-xs flex-1">
					<Outlet />
				</main>
			</div>

			{errorMessage && <ErrorModal message={errorMessage} />}
		</div>
	);
};

const AuthenticatedLayout = withAuth(Layout);

export default AuthenticatedLayout;
