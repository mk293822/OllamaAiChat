import {
  useLayoutEffect,
  useState,
  type PropsWithChildren,
  useMemo,
} from "react";
import type { User } from "../types";
import api from "../api";
import { getCookie } from "../helper";
import { useCallback } from "react";
import { UserContext } from "./UserContext";

const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const getToken = getCookie("auth_token") ?? null;
  const [token, setToken] = useState<string | null>(getToken);

  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const response = await api.get("/api/user");
        setUser(response.data);
      } catch {
        setUser(null);
      }
    }
  }, [token]);

  useLayoutEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    setToken(null);
    setUser(null);
  }

  const registered = () => {
    setToken(getToken);
    fetchUser();
  }

  const contextValue = useMemo(
    () => ({
      user,
      token,
      logout,
      registered
    }),
    [user, token]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
