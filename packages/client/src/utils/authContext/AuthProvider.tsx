import { useCallback, useEffect, useState } from "react";

import { authContext } from "./authContext";
import { api } from "~/api";
import { router } from "~/routes/createRouter";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    const response = await api.routes.checkAuth();
    setIsAuthenticated(response.didError === false);

    setLoading(false);

    return response.didError === false;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navigateToLogin = useCallback(
    async ({ redirect }: { redirect?: string } = {}) => {
      router.navigate({
        to: "/auth/login",
        search: { redirect: redirect ?? router.state.location.href },
      });
    },
    []
  );

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        checkAuth,
        setIsAuthenticated,
        loading,
        navigateToLogin,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export { AuthProvider };
