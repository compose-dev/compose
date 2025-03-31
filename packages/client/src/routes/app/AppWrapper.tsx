import { getRouteApi, Outlet } from "@tanstack/react-router";
import { appStore } from "~/utils/appStore";
import AppNavigation from "./AppNavigation";

const routeApi = getRouteApi("/app/$environmentId/$appRoute");

function AppWrapper() {
  const { environmentId, appRoute } = routeApi.useParams();

  const nav = appStore.useNavigation((state) => {
    if (state.environmentId !== environmentId) {
      return undefined;
    }

    const navId = state.appRouteToNavId[appRoute];

    if (!navId) {
      return undefined;
    }

    return state.navs.find((nav) => nav.id === navId);
  });
  const companyName = appStore.useNavigation((state) => state.companyName);

  return (
    <AppNavigation
      nav={nav}
      companyName={companyName}
      appRoute={appRoute}
      environmentId={environmentId}
    >
      <Outlet />
    </AppNavigation>
  );
}

export default AppWrapper;
