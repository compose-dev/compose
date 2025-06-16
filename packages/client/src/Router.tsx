import { RouterProvider } from "@tanstack/react-router";

import { AuthProvider } from "~/utils/authContext";
import { Suspense } from "react";

import ToastHandler from "./Toast";
import { router } from "./routes/createRouter";

function RouterContainer() {
  return (
    <Suspense>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastHandler />
      </AuthProvider>
    </Suspense>
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

export default RouterContainer;
