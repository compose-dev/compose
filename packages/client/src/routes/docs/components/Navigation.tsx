import { u as uPub } from "@composehq/ts-public";
import AppNavigationDocs from "~/routes/app/AppNavigationDocs";
import { useState } from "react";

function Navigation() {
  const [currentRoute, setCurrentRoute] = useState("home");

  const nav: uPub.navigation.FormattedInterface = {
    id: "navigation",
    items: [
      {
        label: "Home",
        route: "home",
      },
      {
        label: "Settings",
        route: "settings",
      },
    ],
    logoUrl: "https://composehq.com/dark-logo-with-text.svg",
  };

  function getText() {
    if (currentRoute === "home") {
      return "Home Page";
    }

    if (currentRoute === "settings") {
      return "Settings Page";
    }

    return "Page not found";
  }

  return (
    <AppNavigationDocs
      nav={nav}
      companyName="ComposeHQ"
      appRoute={currentRoute}
      onClick={setCurrentRoute}
    >
      <div className="p-4">
        <h3>{getText()}</h3>
      </div>
    </AppNavigationDocs>
  );
}

export default Navigation;
