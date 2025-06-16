/**
 * ALL EDITS TO THIS PAGE SHOULD BE COPIED INTO `AppNavigationDocs.tsx`!
 */

import Button from "~/components/button";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";

function NavigationRoot({
  hideNavigation = false,
  children,
}: {
  hideNavigation?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames({
        "flex flex-col lg:flex-row lg:p-2 bg-brand-overlay dark:bg-brand-io lg:rounded lg:h-dvh":
          !hideNavigation,
      })}
    >
      {children}
    </div>
  );
}

function NavigationDesktopSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pr-2 min-w-56 max-w-56 hidden lg:flex flex-col overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}

function NavigationMobileTopBar({
  logo,
  children,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  logo: React.ReactNode;
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between lg:hidden p-4 fixed top-0 left-0 w-full bg-brand-overlay z-10 border-b border-brand-neutral">
        {logo}
        <Button
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Icon name="sidebar-right" color="brand-neutral" size="1.25" />
        </Button>
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
            "absolute right-0 top-0 h-full w-64 bg-brand-overlay p-4 shadow-lg transition-transform duration-150 ease-in-out overflow-y-auto",
            {
              "translate-x-0": isSidebarOpen,
              "translate-x-full": !isSidebarOpen,
            }
          )}
          style={{ scrollbarWidth: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}

function NavigationContent({
  hideNavigation,
  children,
}: {
  hideNavigation?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames({
        "bg-brand-page w-full lg:border border-brand-neutral rounded-brand overflow-x-auto pt-16 lg:pt-0 flex-1":
          !hideNavigation,
      })}
      style={{ scrollbarWidth: "thin" }}
    >
      {children}
    </div>
  );
}

export {
  NavigationRoot as Root,
  NavigationDesktopSidebar as DesktopSidebar,
  NavigationMobileTopBar as MobileTopBar,
  NavigationContent as Content,
};
