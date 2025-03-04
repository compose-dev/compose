import { Outlet } from "@tanstack/react-router";

function Root() {
  return (
    <div className="h-screen w-screen bg-brand-page text-brand-neutral">
      <Outlet />
    </div>
  );
}

export default Root;
