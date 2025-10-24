import { createBrowserRouter } from "react-router-dom";
import { AuthLayout,RootLayout } from "../layout";
import { Home,Login,FullStack ,Register} from "../pages";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: Register,
          },
        ],
      },
      {
        path: "/fullstack",
        Component: FullStack
      }
    ],
  },
]);
