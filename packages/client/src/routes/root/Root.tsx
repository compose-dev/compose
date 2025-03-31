import { Outlet } from "@tanstack/react-router";

function Root() {
  return (
    <div className="bg-brand-page text-brand-neutral">
      <Outlet />
    </div>
  );
}

export default Root;
