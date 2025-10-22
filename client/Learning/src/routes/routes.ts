import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../pages/Root";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "full-stack",
        lazy: () =>
          import("../pages/FullStack").then(({ default: FullStack }) => ({
            Component: FullStack,
          })),
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
]);
