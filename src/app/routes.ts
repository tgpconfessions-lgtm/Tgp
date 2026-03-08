import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: Admin,
  },
]);