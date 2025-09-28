import type { ReactNode } from "react";
import { HomeActiveIcon, HomeIcon } from "../icon/HomeIcon";
import { CardActiveIcon, CardIcon } from "../icon/CardIcon";
import { HeartIcon } from "../icon/HeartIcon";
import { ChatIcon } from "../icon/ChatIcon";
import { UserIcon } from "../icon/UserIcon";
import { useNavbar } from "../../providers/UseNavbar";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { state, setState } = useNavbar();
  return (
    <div className="min-h-screen bg-home">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </section>
      <section className="fixed flex bottom-0 left-0 justify-between w-full p-3 shadow bg-[#FFF4FE]">
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
        <Link to={""} className="">
          <HeartIcon />
        </Link>
        <Link to={""} className="">
          <ChatIcon />
        </Link>
        <Link to={""} className="">
          <UserIcon />
        </Link>
      </section>
    </div>
  );
};

export default MainLayout;
