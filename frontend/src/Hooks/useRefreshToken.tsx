import axios from "axios";
import api from "../api"
import useError from "./useError";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setErrorMessage } = useError();
    const { setToken } = useAuth();

    const refreshToken = async () => {
        try {
            localStorage.removeItem('accessToken');
            const response = await api.get('/api/refresh');
            setToken(response.data.token);
            localStorage.setItem(
							"accessToken",
							encodeURIComponent(response.data.token)
						);
            return response.data.token;
        } catch (e) {
            setToken(null);
            localStorage.removeItem('accessToken');
            if (axios.isAxiosError(e)) {
                setErrorMessage(e.response?.statusText ?? null);
            } else {
                console.log("UnknownError:", e);
            }
            return null;
        }
    }

    return refreshToken;
}

export default useRefreshToken
