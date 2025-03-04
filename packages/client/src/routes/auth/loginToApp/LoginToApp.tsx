import { useSearch, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "~/api";
import { useAuthContext } from "~/utils/authContext";

export default function LoginToApp() {
  const { checkAuth } = useAuthContext();
  const navigate = useNavigate();

  const appRoute = useSearch({
    from: "/auth/login-to-app",
    select: (search) => search.appRoute,
  });
  const environmentId = useSearch({
    from: "/auth/login-to-app",
    select: (search) => search.environmentId,
  });
  const paramsString = useSearch({
    from: "/auth/login-to-app",
    select: (search) => search.paramsString || "",
  });

  useEffect(() => {
    async function loginToApp() {
      await api.routes.logout();
      const response = await api.routes.loginToApp({ appRoute, environmentId });

      if (response.didError) {
        console.error(response.data.message);
        return;
      }

      if (response.data.success) {
        // update auth context
        await checkAuth();

        navigate({
          to: `/app/${environmentId}/${appRoute}${paramsString}`,
        });
      } else {
        navigate({
          to: "/auth/login",
          search: {
            redirect: `/app/${environmentId}/${appRoute}${paramsString}`,
            appRoute,
            environmentId,
          },
        });
      }
    }

    loginToApp();
  }, [appRoute, environmentId, navigate, checkAuth, paramsString]);

  return null;
}
