import type { ReactNode } from "react";
import OnBoarding from "../components/onBoarding/OnBoarding";
import Login from "../pages/Login";
import Matching from "../pages/matching/Matching";
import NewPet from "../pages/pets/NewPet";
import PetDetail from "../pages/pets/PetDetail";
import Signup from "../pages/Signup";
import Home from "../pages/users/Home";
import MainLayout from "../components/layout/MainLayout";

interface Route {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType<{ children: ReactNode }> | null;
}

export const routes: Route[] = [
  {
    path: "/",
    component: Home,
    layout: MainLayout,
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
    path: "/onboarding",
    component: OnBoarding,
    layout: null,
  },
  {
    path: "/home",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/pets/create",
    component: NewPet,
    layout: MainLayout,
  },
  {
    path: "/pets/:id",
    component: PetDetail,
    layout: MainLayout,
  },
  {
    path: "/matching",
    component: Matching,
    layout: MainLayout,
  },
  // {
  //   path: "/matching/figma",
  //   component: FigmaMatchingApp,
  // },
  // {
  //   path: "/matching/users",
  //   component: UsersMatchListView,
  // },
  // {
  //   path: "/chat/:userId",
  //   component: ChatView,
  // },
];
