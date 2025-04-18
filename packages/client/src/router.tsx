import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { AuthLayout } from "./layouts/auth-layout";
import { UserLayout } from "./layouts/user-layout";
import { ProtectedRoute } from "./components/protected-route";
import { GlobalSpinner } from "./components/global-spinner";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    HydrateFallback: GlobalSpinner,
    children: [
      {
        path: "/",
        Component: ProtectedRoute,
        children: [
          {
            Component: UserLayout,
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import("./pages/home")).HomePage,
                }),
              },
            ],
          },
        ],
      },
      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            lazy: async () => ({
              Component: (await import("./pages/login")).LoginPage,
            }),
          },
          {
            path: "register",
            lazy: async () => ({
              Component: (await import("./pages/register")).RegisterPage,
            }),
          },
        ],
      },
    ],
  },
]);
