/**
 * ALL EDITS TO THIS PAGE SHOULD BE COPIED INTO `AppNavigationDocs.tsx`!
 */

import { Link } from "@tanstack/react-router";
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
          "flex lg:w-full dark:bg-brand-neutral dark:border dark:border-brand-neutral rounded-brand",
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
    <div className={classNames("flex lg:w-full bg-transparent", className)}>
      <h3 className="text-brand-neutral hidden lg:block">{companyName}</h3>
      <h4 className="text-brand-neutral block lg:hidden">{companyName}</h4>
    </div>
  );
}

function NavLink({
  itemRoute,
  itemLabel,
  currentRoute,
  environmentId,
  onClick,
}: {
  itemRoute: string;
  itemLabel: string;
  currentRoute: string;
  environmentId: string;
  onClick?: () => void;
}) {
  return (
    <Link
      className={classNames(
        "flex items-center gap-4 hover:bg-brand-overlay-2 p-2 rounded-brand",
        {
          "bg-brand-overlay-2 text-brand-neutral": itemRoute === currentRoute,
        }
      )}
      to={"/app/$environmentId/$appRoute"}
      params={{
        environmentId,
        appRoute: itemRoute,
      }}
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
    </Link>
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
    <div className="flex items-center justify-between lg:hidden p-4 fixed top-0 left-0 w-full bg-brand-overlay z-10 border-b border-brand-neutral">
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

function AppNavigation({
  children,
  nav,
  companyName,
  appRoute,
  environmentId,
}: {
  children: React.ReactNode;
  nav: uPub.navigation.FormattedInterface | undefined;
  companyName: string;
  appRoute: string;
  environmentId: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={classNames({
        "flex flex-col lg:flex-row lg:p-2 bg-brand-overlay dark:bg-brand-io lg:rounded lg:h-dvh":
          !!nav,
      })}
    >
      {nav && (
        <div
          className="pr-2 min-w-56 max-w-56 hidden lg:block overflow-y-auto"
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
                environmentId={environmentId}
              />
            ))}
          </div>
        </div>
      )}
      {nav && (
        <MobileNavBar
          logoUrl={nav.logoUrl}
          companyName={companyName}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}
      <div
        className={classNames({
          "bg-brand-page rounded-brand w-full lg:border border-brand-neutral overflow-x-auto pt-16 lg:pt-0 flex-1":
            !!nav,
        })}
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
      {nav && (
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
                  environmentId={environmentId}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppNavigation;
