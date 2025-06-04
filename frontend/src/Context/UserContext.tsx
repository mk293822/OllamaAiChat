import { createContext } from "react";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  logout: () => void;
  fetchUser: () => void;
  token: null | string;
  loading: boolean;
};

const UserContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
  fetchUser: () => {},
  loading: true,
});
export default UserContext;

