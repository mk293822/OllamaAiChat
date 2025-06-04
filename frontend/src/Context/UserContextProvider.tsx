import { useLayoutEffect, useState, type PropsWithChildren } from "react";
import type { User } from "../types";
import UserContext from "./UserContext";
import api from "../api";
import { getCookie } from "../helper";

const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const getToken = getCookie("auth_token");
  const [token, setToken] = useState<null | string>(getToken ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    setToken(getToken ?? null);
    if (getToken) {
      setLoading(true);
      try {
        const response = await api.get("/api/user");
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  };

  useLayoutEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, logout, token, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
