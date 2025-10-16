import type { ReactNode } from "react";
import Matching from "../pages/matching/Matching";
import NewPet from "../pages/pets/NewPet";
import PetDetail from "../pages/pets/PetDetail";
import Signup from "../pages/Signup";
import Home from "../pages/users/Home";
import MainLayout from "../components/layout/MainLayout";
import OnBoarding from "../pages/OnBoarding";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Connect from "../pages/Connect";
import Chat from "../pages/Chat";
import SamplePayment from "../pages/users/SamplePayment";
import AdminLoginPage from "../pages/admin/login";
import AdminHomePage from "../pages/admin/home";
import VerifyEmail from "../pages/utils/VerifyEmail";
import ChatView from "../pages/users/ChatView";

interface Route {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType<{ children: ReactNode }> | null;
}

export const routes: Route[] = [
  {
    path: "/",
    component: OnBoarding,
    layout: null,
  },
  {
    path: "/onboarding",
    component: OnBoarding,
    layout: null,
  },
  {
    path: "/login",
    component: Login,
    layout: null,
  },
  {
    path: "/signup",
    component: Signup,
    layout: null,
  },

  {
    path: "/home",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/connect",
    component: Connect,
    layout: MainLayout,
  },
  {
    path: "/chat",
    component: Chat,
    layout: MainLayout,
  },
  {
    path: "/profile",
    component: Profile,
    layout: MainLayout,
  },
  {
    path: "/pets/create",
    component: NewPet,
    layout: MainLayout,
  },
  {
    path: "/pets/:petId",
    component: PetDetail,
    layout: MainLayout,
  },
  {
    path: "/chat/:chatThreadId",
    component: ChatView,
    layout: null,
  },
  {
    path: "/matching",
    component: Matching,
    layout: MainLayout,
  },
  {
    path: "/premium",
    component: SamplePayment,
    layout: MainLayout,
  },
  {
    path: "/admin/login",
    component: AdminLoginPage,
    // layout: MainLayout,
  },
  {
    path: "/admin/home",
    component: AdminHomePage,
    // layout: MainLayout,
  },
  {
    path: "/verify",
    component: VerifyEmail,
    // layout: MainLayout,
  },
  // {
  //   path: "/matching/users",
  //   component: UsersMatchListView,
  // },
];
