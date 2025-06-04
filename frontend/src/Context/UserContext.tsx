import { createContext } from "react";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  token: null | string;
  logout: () => void;
  registered: () => void;
};

export const UserContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
  registered: () => {},
});

