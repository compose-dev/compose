import { createContext } from "react";

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

const authContext = createContext<AuthContextData | null>(null);

export { authContext, type AuthContextData };
