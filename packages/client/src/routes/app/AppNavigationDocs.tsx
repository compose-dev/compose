/**
 * THIS FILE IS A COPY OF AppNavigation.tsx, but with some minor differences for our docs!
 */

import Button from "~/components/button";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";
import { u as uPub } from "@composehq/ts-public";
import { useState } from "react";

function NavLogo({
  logoUrl,
  companyName,
  className = "",
}: {
  logoUrl: string | undefined;
  companyName: string;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div
        className={classNames(
          "flex md:w-full dark:bg-brand-neutral dark:border dark:border-brand-neutral rounded-brand",
          className
        )}
      >
        <img
          src={logoUrl}
          alt={"Logo"}
          className="max-w-48 max-h-8 dark:max-h-7"
        />
      </div>
    );
  }

  return (
    <div className={classNames("flex md:w-full bg-transparent", className)}>
      <h3 className="text-brand-neutral hidden md:block">{companyName}</h3>
      <h4 className="text-brand-neutral block md:hidden">{companyName}</h4>
    </div>
  );
}

function NavLink({
  itemRoute,
  itemLabel,
  currentRoute,
  onClick,
}: {
  itemRoute: string;
  itemLabel: string;
  currentRoute: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={classNames(
        "flex items-center gap-4 hover:bg-brand-overlay-2 p-2 rounded-brand cursor-pointer",
        {
          "bg-brand-overlay-2 text-brand-neutral": itemRoute === currentRoute,
        }
      )}
      onClick={onClick}
    >
      <Icon
        name="bolt"
        color={itemRoute === currentRoute ? "brand-neutral" : "brand-neutral-2"}
        size="1.25"
      />
      <p key={itemRoute} className="truncate">
        {itemLabel}
      </p>
    </div>
  );
}

function MobileNavBar({
  logoUrl,
  companyName,
  toggleSidebar,
}: {
  logoUrl: string | undefined;
  companyName: string;
  toggleSidebar: () => void;
}) {
  return (
    <div className="flex items-center justify-between md:hidden p-4 fixed top-0 left-0 w-full bg-brand-overlay z-10 border-b border-brand-neutral">
      <NavLogo
        logoUrl={logoUrl}
        companyName={companyName}
        className="w-auto p-1 -m-1"
      />
      <Button variant="ghost" onClick={toggleSidebar}>
        <Icon name="sidebar-right" color="brand-neutral" size="1.25" />
      </Button>
    </div>
  );
}

function AppNavigationDocs({
  children,
  nav,
  companyName,
  appRoute,
  onClick,
}: {
  children: React.ReactNode;
  nav: uPub.navigation.FormattedInterface;
  companyName: string;
  appRoute: string;
  onClick: (route: string) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={classNames(
        "flex flex-col md:flex-row w-full overflow-x-hidden md:p-2 bg-brand-overlay dark:bg-brand-io md:rounded overflow-y-hidden h-full"
      )}
    >
      <div
        className="pr-2 min-w-56 max-w-56 hidden md:block overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <NavLogo
          logoUrl={nav.logoUrl}
          companyName={companyName}
          className="mb-4 p-2 sticky top-0 bg-brand-overlay"
        />
        <div className="flex flex-col gap-1 text-brand-neutral-2">
          {nav.items.map((item, index) => (
            <NavLink
              key={index}
              itemRoute={item.route}
              itemLabel={item.label}
              currentRoute={appRoute}
              onClick={() => {
                onClick(item.route);
              }}
            />
          ))}
        </div>
      </div>
      <MobileNavBar
        logoUrl={nav.logoUrl}
        companyName={companyName}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={classNames(
          "bg-brand-page rounded-brand w-full h-full md:border border-brand-neutral overflow-x-auto overflow-y-auto pt-16 md:pt-0"
        )}
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
      <div
        className={classNames("fixed inset-0 z-20", {
          "pointer-events-none": !isSidebarOpen,
          "pointer-events-auto": isSidebarOpen,
        })}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={classNames(
            "absolute inset-0 bg-black/50 transition-opacity duration-150 ease-in-out touch-none",
            {
              "pointer-events-none opacity-0": !isSidebarOpen,
              "pointer-events-auto opacity-100": isSidebarOpen,
            }
          )}
        />
        <div
          className={classNames(
            "absolute right-0 top-0 h-full w-64 bg-brand-overlay p-4 pt-0 shadow-lg transition-transform duration-150 ease-in-out overflow-y-auto",
            {
              "translate-x-0": isSidebarOpen,
              "translate-x-full": !isSidebarOpen,
            }
          )}
          style={{ scrollbarWidth: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 pt-4 sticky top-0 bg-brand-overlay">
            <h2 className="text-lg font-semibold text-brand-neutral">Apps</h2>
            <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
              <Icon name="x" color="brand-neutral" size="0.75" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 text-brand-neutral-2 overflow-y-auto">
            {nav.items.map((item, index) => (
              <NavLink
                key={index}
                itemRoute={item.route}
                itemLabel={item.label}
                currentRoute={appRoute}
                onClick={() => {
                  setIsSidebarOpen(false);
                  onClick(item.route);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppNavigationDocs;
