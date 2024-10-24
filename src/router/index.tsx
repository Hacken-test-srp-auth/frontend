import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login, Profile, Registration } from "~/pages";

import { DefaultLayout } from "~/layout";
import { AuthGuard } from "./AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        path: "/",
        element: <Navigate to="/profile" replace />,
      },
      {
        path: "login",
        element: <AuthGuard Page={Login} />,
      },
      {
        path: "registration",
        element: <AuthGuard Page={Registration} />,
      },
      {
        path: "profile",
        element: <AuthGuard Page={Profile} />,
      },
    ],
  },
]);
