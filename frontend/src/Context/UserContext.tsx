import { createContext } from "react";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  tokenInvalid: boolean;
  logout: () => void;
  refreshUser: () => void;
};

const UserContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  tokenInvalid: true,
  logout: ()=> {},
  refreshUser: ()=> {},
});
export default UserContext;

