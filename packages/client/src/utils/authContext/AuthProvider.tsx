import { useCallback, useEffect, useState } from "react";

import { authContext } from "./authContext";
import { api } from "~/api";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    const response = await api.routes.checkAuth();

    if (response.didError) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);

    return response.didError === false;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <authContext.Provider
      value={{ isAuthenticated, checkAuth, setIsAuthenticated, loading }}
    >
      {children}
    </authContext.Provider>
  );
};

export { AuthProvider };
