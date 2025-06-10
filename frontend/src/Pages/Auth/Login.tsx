import { Button } from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { authRoutes, routes } from "../../routes";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import api from "../../api";
import { AuthContext } from "../../Context/Contexts";
import axios from "axios";
import useError from "../../Hooks/useError";

interface FormData {
	email: string;
	password: string;
}

const Login = () => {
	const [secondLeft, setSecondLeft] = useState<number | null>(null);
	const { setErrorMessage } = useError();
	const navigate = useNavigate();
	const { token, setToken, setUser } = useContext(AuthContext);

	const {
		handleSubmit,
		formState: { errors },
		register,
		setError,
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		if (token) {
			navigate(routes.dashboard);
			return;
		}
		try {
			const response = await api.post("/api/login", data);
			setToken(response.data.token);
			setUser(response.data.user);
			localStorage.setItem(
				"accessToken",
				encodeURIComponent(response.data.token)
			);
			navigate(routes.dashboard);
		} catch (error) {
			handleError(error);
		}
	};

	const handleError = (error: unknown) => {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 422) {
				const regex = /(\d+)\s+seconds?/;
				const match = regex.exec(error.response.data.message);
				const seconds = match ? parseInt(match[1]) : null;

				if (seconds) {
					setSecondLeft(seconds);
				} else {
					Object.entries(error.response.data.errors).forEach((err) => {
						setError(err[0] as keyof FormData, {
							type: "manual",
							message: err && typeof err[1] === "string" ? err[1] : undefined,
						});
					});
				}
			} else {
				setErrorMessage(error.response ? error.response.statusText : null);
			}
		} else {
			console.log("unknownerror:", error);
		}
	};

	useEffect(() => {
		if (secondLeft && secondLeft > 0) {
			const intervalId = setInterval(() => {
				setSecondLeft((prevSeconds) => prevSeconds && prevSeconds - 1);
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [secondLeft]);

	useEffect(() => {
		if (secondLeft && secondLeft > 0) {
			setError("email", {
				type: "manual",
				message: `Too many login attempts. Please try again in ${secondLeft} seconds.`,
			});
		} else if (secondLeft == 0) {
			setError("email", {
				type: "manual",
				message: "You can try logging in again now.",
			});
		}
	}, [secondLeft, setError]);

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input
						type="email"
						placeholder="Email"
						{...register("email", { required: "Email field is required!" })}
						className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
					<input
						type="password"
						placeholder="Password"
						{...register("password", {
							required: "Password field is required!",
						})}
						className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">{errors.password.message}</p>
					)}
					<Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
						Login
					</Button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-400">
					Don’t have an account?{" "}
					<Link
						to={authRoutes.register}
						className="text-blue-400 hover:underline"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
