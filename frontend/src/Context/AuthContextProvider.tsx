import {
	useLayoutEffect,
	useState,
	type PropsWithChildren,
	useMemo,
	useEffect,
} from "react";
import type { User } from "../types";
import api from "../api";
import { AuthContext } from "./Contexts";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import useRefreshToken from "../Hooks/useRefreshToken";
import useError from "../Hooks/useError";
import axios from "axios";

const AuthContextProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);
	const refreshToken = useRefreshToken();
	const { setErrorMessage } = useError();
	const [token, setToken] = useState<string | null>(null);

	useLayoutEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if(accessToken) setToken(decodeURIComponent(accessToken));
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const fetchUser = async () => {
			try {
				if (token) {
					const response = await api.get("/api/user", {
						signal: controller.signal,
					});
					setUser(response.data);
				}
			} catch (error) {
				setUser(null);
				if (axios.isAxiosError(error)) {
					if (!token) {
						setErrorMessage(error.response?.statusText ?? null);
					}
				} else {
					console.log("UnknownError", error);
				}
			}

			return () => controller.abort();
		}; fetchUser();

		return () => controller.abort();
	}, [token, setErrorMessage]);

	useLayoutEffect(() => {
		const authInterceptor = api.interceptors.request.use((config) => {
			config.headers.Authorization = token
				? `Bearer ${token}`
				: config.headers.Authorization;
			return config;
		});

		return () => api.interceptors.request.eject(authInterceptor);
	}, [token]);

	useLayoutEffect(() => {
		const refreshInteceptor = api.interceptors.response.use(
			(res) => res,
			async (error: AxiosError) => {
				const originalRequest = error.config as InternalAxiosRequestConfig & {
					_retry?: boolean;
				};

				if (originalRequest && originalRequest._retry) {
					setToken(null);
					localStorage.removeItem('accessToken');
				} else if (
					originalRequest &&
					error.response?.status === 401 &&
					!originalRequest._retry
				) {
					originalRequest._retry = true;

					try {
						const newToken = await refreshToken();
						if (newToken) {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return api(originalRequest);
						}
					} catch (err) {
						console.log("Token refresh failed", err);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => api.interceptors.response.eject(refreshInteceptor);
	}, [setErrorMessage, refreshToken]);

	const contextValue = useMemo(
		() => ({
			user,
			setUser,
			token,
			setToken,
		}),
		[user, token]
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export default AuthContextProvider;
