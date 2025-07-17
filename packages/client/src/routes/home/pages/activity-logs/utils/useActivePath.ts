import { useLocation, useNavigate, useParams } from "@tanstack/react-router";

const PATHS = {
  APP_RUNS: "app-runs",
  ALL_EVENTS: "all-events",
  EDIT_CUSTOM_REPORT: "edit-custom-report",
} as const;

const VIEW_CUSTOM_REPORT_PATH = (reportId: string) =>
  `view-custom-report_${reportId}` as Path;

type Path = (typeof PATHS)[keyof typeof PATHS];

function getActivePath(pathname: string, reportId: string | undefined) {
  if (pathname.includes("/activity-logs/view-custom-report") && reportId) {
    return VIEW_CUSTOM_REPORT_PATH(reportId);
  }

  if (pathname.includes("/activity-logs/edit-custom-report")) {
    return "edit-custom-report";
  }

  if (pathname.includes("/activity-logs/all-events")) {
    return "all-events";
  }

  if (pathname.includes("/activity-logs")) {
    return "app-runs";
  }

  return null;
}

function useActivePath() {
  const navigate = useNavigate({
    from: "/home/activity-logs",
  });

  const { reportId } = useParams({ strict: false });

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const activePath: Path | null = getActivePath(pathname, reportId);

  const setActivePath = (path: Path) => {
    if (path === "edit-custom-report") {
      navigate({
        to: "/home/activity-logs/edit-custom-report",
      });
    } else if (path === "all-events") {
      navigate({
        to: "/home/activity-logs/all-events",
      });
    } else if (path === "app-runs") {
      navigate({
        to: "/home/activity-logs",
      });
    } else if ((path as string).startsWith("view-custom-report_")) {
      navigate({
        to: "/home/activity-logs/view-custom-report/$reportId",
        params: {
          reportId: (path as string).split("_")[1],
        },
      });
    }
  };

  return { activePath, setActivePath };
}

export { PATHS, type Path, useActivePath, VIEW_CUSTOM_REPORT_PATH };
