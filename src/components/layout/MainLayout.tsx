import type { ReactNode } from "react";
import { HomeActiveIcon, HomeIcon } from "../icon/HomeIcon";
import { CardActiveIcon, CardIcon } from "../icon/CardIcon";
import { HeartActiveIcon, HeartIcon } from "../icon/HeartIcon";
import { ChatActiveIcon, ChatIcon } from "../icon/ChatIcon";
import { UserActiveIcon, UserIcon } from "../icon/UserIcon";
import { useNavbar } from "../../providers/UseNavbar";
import { Link } from "react-router";

import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { state, setState } = useNavbar();
  return (
    <div id="main_layout_root_container" className="min-h-screen bg-home">
      <section
        id="main_layout_content_section"
        // className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
      >
        {children}
      </section>
      <section
        id="main_layout_navbar"
        className="flex justify-between w-full p-3 shadow bg-[#FFF4FE]">
        <Link to={"/home"} onClick={() => setState("home")} className="">
          {state === "home" ? <HomeActiveIcon /> : <HomeIcon />}
        </Link>
        <Link
          to={"/matching"}
          onClick={() => setState("matching")}
          className=""
        >
          {state === "matching" ? <CardActiveIcon /> : <CardIcon />}
        </Link>
        <Link
          to={"/connect"}
          onClick={() => setState("connect")}
          className=""
        >
          {state === "connect" ? <HeartActiveIcon /> : <HeartIcon />}
        </Link>
        <Link
          to={"/chat"}
          onClick={() => setState("chat")}
          className="">
          {state === "chat" ? <ChatActiveIcon /> : <ChatIcon />}
        </Link>
        <Link
          to={"/profile"}
          onClick={() => setState("profile")}
          className=""
        >
          {state === "profile" ? <UserActiveIcon /> : <UserIcon />}
        </Link>
      </section>
    </div>
  );
};

export default MainLayout;
