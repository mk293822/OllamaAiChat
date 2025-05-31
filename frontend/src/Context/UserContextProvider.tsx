import { useEffect, useState, type PropsWithChildren } from "react";
import type { User } from "../types";
import { getCookie } from "../helper";
import UserContext from "./UserContext";

const UserContextProvider = ({ children, onReady }: PropsWithChildren<{onReady?: ()=> void}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const token = getCookie("auth_token");

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${decodeURIComponent(token ?? "")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401 || res.status === 403) {
        setTokenInvalid(true); // now this is meaningful
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setTokenInvalid(true);
    } finally {
      onReady?.();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setTokenInvalid(true); // no token = invalid
      setIsLoading(false);
      onReady?.();
    }
  }, [token]);

  const logout = () => {
    setTokenInvalid(true);
    setUser(null);
  }

  const refreshUser = () => fetchUser();

  return (
    <UserContext.Provider value={{ user, isLoading, tokenInvalid, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;